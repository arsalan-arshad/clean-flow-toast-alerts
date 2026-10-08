/**
 * @description Controller providing AuraEnabled endpoints for LWC components.
 */
public with sharing class FlowToastController {
    /**
     * @description Returns standard default options and metadata for Flow Toast components.
     * @return Map with variants, modes, sound options, and current user ID
     */
    @AuraEnabled(cacheable=true)
    public static Map<String, Object> getToastDefaults() {
        Map<String, Object> defaults = new Map<String, Object>();
        defaults.put('currentUserId', UserInfo.getUserId());
        defaults.put('defaultVariant', FlowToastService.DEFAULT_VARIANT);
        defaults.put('defaultMode', FlowToastService.DEFAULT_MODE);
        defaults.put('validVariants', new List<String>(FlowToastService.VALID_VARIANTS));
        defaults.put('validModes', new List<String>(FlowToastService.VALID_MODES));
        defaults.put('validSounds', new List<String>{ 'chime', 'success', 'bell', 'warning', 'error', 'fanfare' });
        return defaults;
    }

    /**
     * @description Fires a toast platform event from LWC or UI components.
     * @param payload Map of toast parameters
     * @return FlowToastService.ToastResult
     */
    @AuraEnabled
    public static FlowToastService.ToastResult publishToast(Map<String, Object> payload) {
        if (payload == null) {
            throw new AuraHandledException('Toast payload cannot be empty.');
        }

        FlowToastService.ToastRequest req = new FlowToastService.ToastRequest();
        req.title = (String) payload.get('title');
        req.message = (String) payload.get('message');
        req.variant = (String) payload.get('variant');
        req.mode = (String) payload.get('mode');
        req.url = (String) payload.get('url');
        req.urlLabel = (String) payload.get('urlLabel');
        req.recordId = (String) payload.get('recordId');
        req.targetUserId = (String) payload.get('targetUserId');
        req.playSound = payload.containsKey('playSound') ? (Boolean) payload.get('playSound') : false;
        req.soundType = (String) payload.get('soundType');

        try {
            return FlowToastService.publishToastEvent(req);
        } catch (Exception ex) {
            throw new AuraHandledException(ex.getMessage());
        }
    }
}
