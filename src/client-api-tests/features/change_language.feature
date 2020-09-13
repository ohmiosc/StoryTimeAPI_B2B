Feature: client.api: Change language
  @notAllowedForProd
  @after-removeDeviceIdFromDynamoDB
  Scenario: Change language to disneystorytime-es
    Given I launch application
    Given I clean extra tables data
    Given I do alternative login for active user
    When I do call "POST" request to "/appuser/edituser" with body:
			"""
			{
			"productID": ${user.productID},
			"productIDNew":"disneystorytime-es",
			"deviceID": ${user.deviceID},
			"appUserID": ${user.appUserID}
			}
			"""
    Then I receives status code "200"
    And The response should contain:
			"""
			{
              "deviceID": ${user.deviceID},
              "appUserID": ${user.appUserID},
              "isSucceeded": 1,
              "userType": 4,
              "productID": "disneystorytime-es"
			}
			"""





