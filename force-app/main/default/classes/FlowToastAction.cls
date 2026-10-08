/**
 * @description Invocable Action enabling Salesforce Screen Flows, Record-Triggered Flows,
 *              Autolaunched Flows, and Agentforce AI Agents to fire rich toasts.
 */
public inherited sharing class FlowToastAction {
    /**
     * @description Invocable input parameters for Flow builder & Agentforce.
     */
    public class ToastActionRequest {
        @InvocableVariable(label='Title' description='Header or title of the toast notification' required=false)
        public String title;

        @InvocableVariable(label='Message' description='Main message body of the toast' required=true)
        public String message;

        @InvocableVariable(
            label='Variant'
            description='SLDS variant: success, error, warning, info (Default: info)'
            required=false
        )
        public String variant;

        @InvocableVariable(
            label='Mode'
            description='SLDS mode: dismissible, pester, sticky (Default: dismissible)'
            required=false
        )
        public String mode;

        @InvocableVariable(label='URL' description='Optional hyperlink URL' required=false)
        public String url;

        @InvocableVariable(label='URL Label' description='Label for hyperlink URL' required=false)
        public String urlLabel;

        @InvocableVariable(label='Record ID' description='Salesforce record ID to link or navigate to' required=false)
        public String recordId;

        @InvocableVariable(
            label='Target User ID'
            description='Target specific User ID. Leave blank for active session.'
            required=false
        )
        public String targetUserId;

        @InvocableVariable(label='Play Sound' description='Play subtle notification chime' required=false)
        public Boolean playSound;

        @InvocableVariable(
            label='Sound Type'
            description='Sound type: chime, success, bell, warning, error'
            required=false
        )
        public String soundType;
    }

    /**
     * @description Invocable output parameters returned to Flow or Agentforce.
     */
    public class ToastActionResult {
        @InvocableVariable(label='Is Success' description='True if toast event was published successfully')
        public Boolean isSuccess;

        @InvocableVariable(label='Error Message' description='Error message if publishing failed')
        public String errorMessage;

        @InvocableVariable(label='Event ID' description='Platform event publication ID')
        public String eventId;

        public ToastActionResult() {
            this.isSuccess = false;
        }

        public ToastActionResult(Boolean isSuccess, String errorMessage, String eventId) {
            this.isSuccess = isSuccess;
            this.errorMessage = errorMessage;
            this.eventId = eventId;
        }
    }

    /**
     * @description Invocable method to broadcast toast notifications.
     * @param requests List of ToastActionRequest inputs from Flow or Agentforce
     * @return List of ToastActionResult outputs
     */
    @InvocableMethod(
        label='Show Flow Toast'
        description='Publishes a rich toast notification event from Screen Flows, Autolaunched Flows, Record-Triggered Flows, or Agentforce AI Agents.'
        category='Flow UI Supercharger'
    )
    public static List<ToastActionResult> showToast(List<ToastActionRequest> requests) {
        List<ToastActionResult> actionResults = new List<ToastActionResult>();

        if (requests == null || requests.isEmpty()) {
            return actionResults;
        }

        List<FlowToastService.ToastRequest> serviceRequests = new List<FlowToastService.ToastRequest>();
        for (ToastActionRequest req : requests) {
            FlowToastService.ToastRequest sReq = new FlowToastService.ToastRequest();
            if (req != null) {
                sReq.title = req.title;
                sReq.message = req.message;
                sReq.variant = req.variant;
                sReq.mode = req.mode;
                sReq.url = req.url;
                sReq.urlLabel = req.urlLabel;
                sReq.recordId = req.recordId;
                sReq.targetUserId = req.targetUserId;
                sReq.playSound = req.playSound;
                sReq.soundType = req.soundType;
            }
            serviceRequests.add(sReq);
        }

        List<FlowToastService.ToastResult> sResults = FlowToastService.publishToastEvents(serviceRequests);

        for (FlowToastService.ToastResult sRes : sResults) {
            actionResults.add(new ToastActionResult(sRes.isSuccess, sRes.errorMessage, sRes.eventId));
        }

        return actionResults;
    }
}
