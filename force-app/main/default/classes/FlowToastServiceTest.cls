/**
 * @description Unit tests for FlowToastService (Positive, Negative, Bulk, Edge Cases).
 */
@IsTest
private class FlowToastServiceTest {
    @IsTest
    static void testSinglePublishSuccess() {
        Test.startTest();
        FlowToastService.ToastRequest req = new FlowToastService.ToastRequest();
        req.title = 'Test Success Title';
        req.message = 'Record has been created successfully.';
        req.variant = 'success';
        req.mode = 'dismissible';
        req.url = 'https://salesforce.com';
        req.urlLabel = 'Open Link';
        req.recordId = '001000000000001AAA';
        req.targetUserId = UserInfo.getUserId();
        req.playSound = true;
        req.soundType = 'success';

        FlowToastService.ToastResult result = FlowToastService.publishToastEvent(req);
        Test.stopTest();

        System.assertNotEquals(null, result, 'Result should not be null');
        System.assertEquals(true, result.isSuccess, 'Publish should succeed');
        System.assertEquals(null, result.errorMessage, 'Error message should be null');
    }

    @IsTest
    static void testBulkPublishSuccess() {
        List<FlowToastService.ToastRequest> requests = new List<FlowToastService.ToastRequest>();
        for (Integer i = 0; i < 200; i++) {
            FlowToastService.ToastRequest req = new FlowToastService.ToastRequest();
            req.title = 'Bulk Notification #' + i;
            req.message = 'Processing queue item #' + i;
            req.variant = (Math.mod(i, 2) == 0) ? 'success' : 'info';
            req.mode = 'dismissible';
            req.playSound = false;
            requests.add(req);
        }

        Test.startTest();
        List<FlowToastService.ToastResult> results = FlowToastService.publishToastEvents(requests);
        Test.stopTest();

        System.assertEquals(200, results.size(), 'Should return 200 results');
        for (FlowToastService.ToastResult res : results) {
            System.assertEquals(true, res.isSuccess, 'Each bulk event should succeed');
        }
    }

    @IsTest
    static void testNormalizationAndDefaults() {
        System.assertEquals('info', FlowToastService.normalizeVariant(null), 'Null variant should default to info');
        System.assertEquals('info', FlowToastService.normalizeVariant(''), 'Empty variant should default to info');
        System.assertEquals(
            'info',
            FlowToastService.normalizeVariant('INVALID_VARIANT'),
            'Invalid variant should default to info'
        );
        System.assertEquals('success', FlowToastService.normalizeVariant('SUCCESS'), 'Upper variant should normalize');
        System.assertEquals(
            'warning',
            FlowToastService.normalizeVariant(' warning '),
            'Trimmed variant should normalize'
        );
        System.assertEquals('error', FlowToastService.normalizeVariant('error'), 'Error variant should normalize');

        System.assertEquals(
            'dismissible',
            FlowToastService.normalizeMode(null),
            'Null mode should default to dismissible'
        );
        System.assertEquals(
            'dismissible',
            FlowToastService.normalizeMode(''),
            'Empty mode should default to dismissible'
        );
        System.assertEquals(
            'dismissible',
            FlowToastService.normalizeMode('STICKY_UNKNOWN'),
            'Invalid mode should default to dismissible'
        );
        System.assertEquals('pester', FlowToastService.normalizeMode('PESTER'), 'Upper mode should normalize');
        System.assertEquals('sticky', FlowToastService.normalizeMode(' sticky '), 'Trimmed mode should normalize');
    }

    @IsTest
    static void testAbbreviationLimits() {
        String longTitle = 'A'.repeat(300);
        String longUrl = 'https://example.com/' + 'x'.repeat(300);

        FlowToastService.ToastRequest req = new FlowToastService.ToastRequest();
        req.title = longTitle;
        req.message = 'Abbreviation test';
        req.url = longUrl;
        req.urlLabel = longTitle;

        Test.startTest();
        Clean_Flow_Toast_Event__e evt = FlowToastService.buildEvent(req);
        Test.stopTest();

        System.assertEquals(255, evt.Title__c.length(), 'Title must be abbreviated to 255 chars');
        System.assertEquals(255, evt.Url__c.length(), 'Url must be abbreviated to 255 chars');
        System.assertEquals(255, evt.Url_Label__c.length(), 'UrlLabel must be abbreviated to 255 chars');
    }

    @IsTest
    static void testNullOrEmptyListPublish() {
        Test.startTest();
        List<FlowToastService.ToastResult> nullResults = FlowToastService.publishToastEvents(null);
        List<FlowToastService.ToastResult> emptyResults = FlowToastService.publishToastEvents(
            new List<FlowToastService.ToastRequest>()
        );
        Test.stopTest();

        System.assertNotEquals(null, nullResults, 'Null list should return empty list');
        System.assertEquals(0, nullResults.size(), 'Null list result size should be 0');
        System.assertEquals(0, emptyResults.size(), 'Empty list result size should be 0');
    }

    @IsTest
    static void testValidationNullAndBlankErrors() {
        FlowToastService.ToastRequest nullMsgReq = new FlowToastService.ToastRequest();
        nullMsgReq.title = 'Test Title';
        nullMsgReq.message = '   ';

        Test.startTest();
        List<FlowToastService.ToastResult> results = FlowToastService.publishToastEvents(
            new List<FlowToastService.ToastRequest>{ null, nullMsgReq }
        );
        Test.stopTest();

        System.assertEquals(2, results.size(), 'Should return 2 results');
        System.assertEquals(false, results[0].isSuccess, 'Null request should fail');
        System.assert(results[0].errorMessage.contains('cannot be null'), 'Message should indicate null');
        System.assertEquals(false, results[1].isSuccess, 'Blank message request should fail');
        System.assert(results[1].errorMessage.contains('empty or blank'), 'Message should indicate blank');
    }
}
