Feature: client.api: Get questions user data@notAllowedForProd
  @after-removeDeviceIdFromDynamoDB
  Scenario: Get questions user data
    Given I launch application
    Given I clean extra tables data
    When I do call "POST" request to "/appuser/getquestionsuserdata" with body:
			"""
			{
			"productID": ${user.productID},
			"deviceID": ${user.deviceID},
			"appUserID": ${user.appUserID}
			}
			"""
    Then I receives status code "200"
    And The response should contain:
			"""
			{
			"productID": ${user.productID},
            "appUserID": ${user.appUserID},
            "questionsUserDataList": []
			}
			"""





