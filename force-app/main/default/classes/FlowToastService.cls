/**
 * @description Enterprise Service layer for Clean Flow Toast & Alerts.
 *              Handles validation, payload normalization, and high-volume Platform Event publishing.
 */
public inherited sharing class FlowToastService {
    public static final String DEFAULT_VARIANT = 'info';
    public static final String DEFAULT_MODE = 'dismissible';
    public static final Set<String> VALID_VARIANTS = new Set<String>{ 'info', 'success', 'warning', 'error' };
    public static final Set<String> VALID_MODES = new Set<String>{ 'dismissible', 'pester', 'sticky' };

    public class FlowToastException extends Exception {
    }

    /**
     * @description Data Transfer Object representing a Toast request payload.
     */
    public class ToastRequest {
        public String title;
        public String message;
        public String variant;
        public String mode;
        public String url;
        public String urlLabel;
        public String recordId;
        public String targetUserId;
        public Boolean playSound;
        public String soundType;

        public ToastRequest() {
            this.playSound = false;
        }
    }

    /**
     * @description Result payload returned after publishing.
     */
    public class ToastResult {
        public Boolean isSuccess;
        public String errorMessage;
        public String eventId;

        public ToastResult() {
            this.isSuccess = false;
        }

        public ToastResult(Boolean isSuccess, String errorMessage, String eventId) {
            this.isSuccess = isSuccess;
            this.errorMessage = errorMessage;
            this.eventId = eventId;
        }
    }

    /**
     * @description Bulkified publisher for Toast Requests.
     * @param requests List of ToastRequest DTOs
     * @return List of ToastResult DTOs
     */
    public static List<ToastResult> publishToastEvents(List<ToastRequest> requests) {
        List<ToastResult> results = new List<ToastResult>();

        if (requests == null || requests.isEmpty()) {
            return results;
        }

        List<Clean_Flow_Toast_Event__e> eventsToPublish = new List<Clean_Flow_Toast_Event__e>();
        Map<Integer, ToastResult> errorMap = new Map<Integer, ToastResult>();
        List<Integer> validIndices = new List<Integer>();

        for (Integer i = 0; i < requests.size(); i++) {
            ToastRequest req = requests[i];
            try {
                validateRequest(req);
                Clean_Flow_Toast_Event__e evt = buildEvent(req);
                eventsToPublish.add(evt);
                validIndices.add(i);
            } catch (Exception ex) {
                errorMap.put(i, new ToastResult(false, ex.getMessage(), null));
            }
        }

        List<Database.SaveResult> saveResults = new List<Database.SaveResult>();
        if (!eventsToPublish.isEmpty()) {
            saveResults = EventBus.publish(eventsToPublish);
        }

        Integer publishIndex = 0;
        for (Integer i = 0; i < requests.size(); i++) {
            if (errorMap.containsKey(i)) {
                results.add(errorMap.get(i));
            } else {
                Database.SaveResult sr = saveResults[publishIndex];
                if (sr.isSuccess()) {
                    results.add(new ToastResult(true, null, sr.getId()));
                } else {
                    List<String> errors = new List<String>();
                    for (Database.Error err : sr.getErrors()) {
                        errors.add(err.getStatusCode() + ': ' + err.getMessage());
                    }
                    results.add(new ToastResult(false, String.join(errors, '; '), null));
                }
                publishIndex++;
            }
        }

        return results;
    }

    /**
     * @description Single event publisher helper.
     * @param request ToastRequest DTO
     * @return ToastResult DTO
     */
    public static ToastResult publishToastEvent(ToastRequest request) {
        List<ToastResult> results = publishToastEvents(new List<ToastRequest>{ request });
        return (results != null && !results.isEmpty()) ? results[0] : new ToastResult(false, 'Unknown error', null);
    }

    /**
     * @description Validates incoming request parameters.
     * @param req ToastRequest
     */
    public static void validateRequest(ToastRequest req) {
        if (req == null) {
            throw new FlowToastException('Toast request cannot be null.');
        }
        if (String.isBlank(req.message)) {
            throw new FlowToastException('Toast message cannot be empty or blank.');
        }
    }

    /**
     * @description Maps and normalizes a ToastRequest to a Clean_Flow_Toast_Event__e record.
     * @param req ToastRequest
     * @return Clean_Flow_Toast_Event__e
     */
    public static Clean_Flow_Toast_Event__e buildEvent(ToastRequest req) {
        Clean_Flow_Toast_Event__e evt = new Clean_Flow_Toast_Event__e();
        evt.Title__c = String.isNotBlank(req.title) ? req.title.abbreviate(255) : '';
        evt.Message__c = req.message;
        evt.Variant__c = normalizeVariant(req.variant);
        evt.Mode__c = normalizeMode(req.mode);
        evt.Url__c = String.isNotBlank(req.url) ? req.url.abbreviate(255) : null;
        evt.Url_Label__c = String.isNotBlank(req.urlLabel) ? req.urlLabel.abbreviate(255) : null;
        evt.Record_Id__c = String.isNotBlank(req.recordId) ? req.recordId.trim() : null;
        evt.Target_User_Id__c = String.isNotBlank(req.targetUserId) ? req.targetUserId.trim() : null;
        evt.Play_Sound__c = (req.playSound == true);
        evt.Sound_Type__c = String.isNotBlank(req.soundType) ? req.soundType.trim().toLowerCase() : 'chime';
        return evt;
    }

    /**
     * @description Normalizes variant to lowercase SLDS standard (info, success, warning, error).
     * @param variant Input variant
     * @return Normalized variant string
     */
    public static String normalizeVariant(String variant) {
        if (String.isBlank(variant)) {
            return DEFAULT_VARIANT;
        }
        String normalized = variant.trim().toLowerCase();
        return VALID_VARIANTS.contains(normalized) ? normalized : DEFAULT_VARIANT;
    }

    /**
     * @description Normalizes mode to lowercase SLDS standard (dismissible, pester, sticky).
     * @param mode Input mode
     * @return Normalized mode string
     */
    public static String normalizeMode(String mode) {
        if (String.isBlank(mode)) {
            return DEFAULT_MODE;
        }
        String normalized = mode.trim().toLowerCase();
        return VALID_MODES.contains(normalized) ? normalized : DEFAULT_MODE;
    }
}
