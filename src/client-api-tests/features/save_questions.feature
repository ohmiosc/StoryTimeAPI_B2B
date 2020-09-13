Feature: client.api: Save question
  @notAllowedForProd
  @after-removeDeviceIdFromDynamoDB
  @after-removeProgressFromDynamoDB
  Scenario: Save questions progress
    Given I launch application
    Given I clean extra tables data
    When I do call "POST" request to "/appuser/questionsuserdata " with body:
			"""
              {
			    "productID": ${user.productID},
			    "deviceID": ${user.deviceID},
			    "appUserID": ${user.appUserID},
			    "versionID": 1,
                "questionsUserDataList":[
	                {"ID":7204,"correctAnswers":1},
	                {"ID":3612,"correctAnswers":0},
	                {"ID":3179,"correctAnswers":1}
	            ]
              }
			"""
    Then I receives status code "200"
    And The response should contain:
            """
             {
             "message": "New entry OK"
             }
             """
