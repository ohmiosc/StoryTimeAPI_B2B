Feature: client.api: Save vocabs
  @notAllowedForProd
  @after-removeDeviceIdFromDynamoDB
  @after-removeProgressFromDynamoDB
  Scenario: Save vocabs progress
    Given I launch application
    Given I clean extra tables data
    When I do call "POST" request to "/appuser/vocabsuserdata " with body:
			"""
              {
			    "productID": ${user.productID},
			    "deviceID": ${user.deviceID},
			    "appUserID": ${user.appUserID},
			    "versionID": 1,
			    "lastSeenCategory": 1,
                "lastPlayedLevel": [
                   {
                      "level": 1,
                      "templateID": 703
                   },
                   {
                      "level": 0,
                      "templateID": 705
                   }
                ],
                "vocabsUserDataList": [
                  {
                    "ID": 0,
                    "rates": [
                      {
                        "expose": 6,
                        "failure": 0,
                        "knowledge": 3,
                        "voiceFailure": 0,
                        "voiceSuccess": 0
                      }
                    ]
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
