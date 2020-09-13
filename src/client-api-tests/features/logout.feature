Feature: client.api: Logout
  @notAllowedForProd
  Scenario: Do valid logout
    Given I launch application
    Given I clean extra tables data
    When I do call "POST" request to "/appuser/logout" with body:
			"""
			{
			    "appUserID": ${user.appUserID},
			    "productID": ${user.productID},
			    "deviceID": ${user.deviceID}
			}
			"""
    Then I receives status code "200"
    And The response should contain:
			"""
			{
			    "appUserID": ${user.appUserID},
			    "deviceID": "",
			    "userType": ${user.userType},
			    "productID": ${user.productID},
			    "isSucceeded": 1
			}
			"""
  Scenario: Do logout with non-existed appUserID
    When I do call "POST" request to "/appuser/logout" with body:
			"""
			{
			    "appUserID": "test",
			    "productID": "disneystorytime-pt",
			    "deviceID": "test"

			}
			"""
    Then I receives status code "200"
    And The response should contain:
			"""
			{
			    "statusCode": 404,
			    "status": "Not found"
			}
			"""
  Scenario:  Do logout without appUserID
    When I do call "POST" request to "/appuser/logout" with body:
			"""
			{
			    "productID": "disneystorytime-pt",
			    "deviceID": "test"

			}
			"""
    Then I receives status code "200"
    And The response should contain:
			"""
			{
			"statusCode": 400,
			"status": "Bad Request"
			}
			"""
  Scenario:  Do logout without productID
    When I do call "POST" request to "/appuser/logout" with body:
			"""
			{
			    "appUserID": "test",
			    "deviceID": "test"

			}
			"""
    Then I receives status code "200"
    And The response should contain:
			"""
			{
			"statusCode": 400,
			"status": "Bad Request"
			}
			"""
  Scenario:  Do logout with wrong format productID
    When I do call "POST" request to "/appuser/logout" with body:
			"""
			{
			    "appUserID": "test",
			    "productID": "disneystorytimept",
			    "deviceID": "test"

			}
			"""
    Then I receives status code "200"
    And The response should contain:
			"""
			{
                "statusCode": 400,
                "status": "Bad Request"
			}
			"""

