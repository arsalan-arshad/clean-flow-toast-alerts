/**
 * @description Unit tests for FlowToastAction Invocable Action (Flow & Agentforce testing).
 */
@IsTest
private class FlowToastActionTest {
    @IsTest
    static void testInvocableSingleExecution() {
        FlowToastAction.ToastActionRequest req = new FlowToastAction.ToastActionRequest();
        req.title = 'Opportunity Closed Won';
        req.message = 'High-five! Opportunity ACME Global closed for $100,000.';
        req.variant = 'success';
        req.mode = 'dismissible';
        req.url = '/006000000000001AAA';
        req.urlLabel = 'View Deal';
        req.recordId = '006000000000001AAA';
        req.playSound = true;
        req.soundType = 'fanfare';

        Test.startTest();
        List<FlowToastAction.ToastActionResult> results = FlowToastAction.showToast(
            new List<FlowToastAction.ToastActionRequest>{ req }
        );
        Test.stopTest();

        System.assertNotEquals(null, results, 'Results should not be null');
        System.assertEquals(1, results.size(), 'Should return 1 result');
        System.assertEquals(true, results[0].isSuccess, 'Action should succeed');
        System.assertEquals(null, results[0].errorMessage, 'Error should be null');
    }

    @IsTest
    static void testInvocableBulkExecution() {
        List<FlowToastAction.ToastActionRequest> requests = new List<FlowToastAction.ToastActionRequest>();
        for (Integer i = 0; i < 50; i++) {
            FlowToastAction.ToastActionRequest req = new FlowToastAction.ToastActionRequest();
            req.title = 'Notice #' + i;
            req.message = 'Status update for account #' + i;
            req.variant = 'info';
            req.mode = 'pester';
            requests.add(req);
        }

        Test.startTest();
        List<FlowToastAction.ToastActionResult> results = FlowToastAction.showToast(requests);
        Test.stopTest();

        System.assertEquals(50, results.size(), 'Should return 50 results');
        for (FlowToastAction.ToastActionResult res : results) {
            System.assertEquals(true, res.isSuccess, 'Bulk action execution should succeed');
        }
    }

    @IsTest
    static void testInvocableNullAndEmptyRequests() {
        Test.startTest();
        List<FlowToastAction.ToastActionResult> nullRes = FlowToastAction.showToast(null);
        List<FlowToastAction.ToastActionResult> emptyRes = FlowToastAction.showToast(
            new List<FlowToastAction.ToastActionRequest>()
        );
        Test.stopTest();

        System.assertNotEquals(null, nullRes, 'Null input should return empty list');
        System.assertEquals(0, nullRes.size(), 'Null input size should be 0');
        System.assertEquals(0, emptyRes.size(), 'Empty input size should be 0');
    }

    @IsTest
    static void testInvocableFailureHandling() {
        FlowToastAction.ToastActionRequest invalidReq = new FlowToastAction.ToastActionRequest();
        invalidReq.title = 'Invalid';
        invalidReq.message = ''; // blank message should fail validation

        Test.startTest();
        List<FlowToastAction.ToastActionResult> results = FlowToastAction.showToast(
            new List<FlowToastAction.ToastActionRequest>{ invalidReq }
        );
        Test.stopTest();

        System.assertEquals(1, results.size(), 'Should return 1 result');
        System.assertEquals(false, results[0].isSuccess, 'Invalid request should return isSuccess=false');
        System.assertNotEquals(null, results[0].errorMessage, 'Error message should be present');
    }
}
