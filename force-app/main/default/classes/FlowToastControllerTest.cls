/**
 * @description Unit tests for FlowToastController AuraEnabled endpoints.
 */
@IsTest
private class FlowToastControllerTest {
    @IsTest
    static void testGetToastDefaults() {
        Test.startTest();
        Map<String, Object> defaults = FlowToastController.getToastDefaults();
        Test.stopTest();

        System.assertNotEquals(null, defaults, 'Defaults map should not be null');
        System.assertEquals(UserInfo.getUserId(), defaults.get('currentUserId'), 'Should return running user ID');
        System.assertEquals('info', defaults.get('defaultVariant'), 'Default variant should be info');
        System.assertEquals('dismissible', defaults.get('defaultMode'), 'Default mode should be dismissible');
        List<String> variants = (List<String>) defaults.get('validVariants');
        System.assert(variants.contains('success'), 'Should contain success variant');
    }

    @IsTest
    static void testPublishToastSuccess() {
        Map<String, Object> payload = new Map<String, Object>{
            'title' => 'Controller Test',
            'message' => 'Controller test toast notification message.',
            'variant' => 'success',
            'mode' => 'dismissible',
            'playSound' => true,
            'soundType' => 'bell'
        };

        Test.startTest();
        FlowToastService.ToastResult result = FlowToastController.publishToast(payload);
        Test.stopTest();

        System.assertNotEquals(null, result, 'Result should not be null');
        System.assertEquals(true, result.isSuccess, 'Controller publish should succeed');
    }

    @IsTest
    static void testPublishToastNullPayload() {
        Boolean exceptionCaught = false;
        Test.startTest();
        try {
            FlowToastController.publishToast(null);
        } catch (AuraHandledException ahe) {
            exceptionCaught = true;
        }
        Test.stopTest();

        System.assertEquals(true, exceptionCaught, 'AuraHandledException should be thrown for null payload');
    }

    @IsTest
    static void testPublishToastBlankMessage() {
        Map<String, Object> payload = new Map<String, Object>{ 'title' => 'Blank Message Test', 'message' => '' };

        Boolean exceptionCaught = false;
        Test.startTest();
        try {
            FlowToastController.publishToast(payload);
        } catch (AuraHandledException ahe) {
            exceptionCaught = true;
        }
        Test.stopTest();

        System.assertEquals(true, exceptionCaught, 'AuraHandledException should be thrown for empty message');
    }
}
