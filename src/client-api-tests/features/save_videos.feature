Feature: client.api: Save videos
  @notAllowedForProd
  @after-removeDeviceIdFromDynamoDB
  @after-removeProgressFromDynamoDB
  Scenario: Save videos progress
    Given I launch application
    Given I clean extra tables data
    When I do call "POST" request to "/appuser/videosuserdata" with body:
			"""
              {
			    "productID": ${user.productID},
			    "deviceID": ${user.deviceID},
			    "appUserID": ${user.appUserID},
			    "versionID": 1,
                "videosProgress":[
                    {
                      "frames": 1500,
                      "pageID": "VideoPage_Frozen_Part_3_PT_w"
                    },
                    {
                       "frames": 2500,
                       "pageID": "VideoPage_Frozen_Part_1_PT_w"
                    }
	            ],
                "franchiseUserDataList":[
                    {
                        "franchiseTemplateID": 305,
                        "lastSeenVideoPageID": "VideoPage_Frozen_Part_1_SP_NADYA_w"
                     },
                     {
                        "franchiseTemplateID": 301,
                        "lastSeenVideoPageID": "VideoPage_Frozen_Part_1_SP_NADYA_w"
                     }
	             ]
              }
			"""
    Then I receives status code "200"
    And The response should contain:
            """
             {
             "message": "New entry created OK"
             }
             """
