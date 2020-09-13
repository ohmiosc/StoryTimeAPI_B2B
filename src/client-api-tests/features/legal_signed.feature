Feature: client.api: Legal Signed
	@notAllowedForProd
	@after-removeDeviceIdFromDynamoDB
	Scenario: Sign Legal
		Given I launch application
		Given I clean extra tables data
		When I do call "POST" request to "/appuser/legalsigned" for login with body:
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
                "deviceID": ${user.deviceID},
                "userType": 0,
                "appUserID": ${user.appUserID},
                "isSucceeded": 1
            }
            """
			
	Scenario: Sign legal with non-existed appUserID
		When I do call "POST" request to "/appuser/legalsigned" with body:
			"""
			{
			    "appUserID": "test",
			    "deviceID": "test",
			    "productID": "disneystorytime-pt"
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

	Scenario:  Sign legal without appUserID
		When I do call "POST" request to "/appuser/legalsigned" with body:
			"""
			{
			    "deviceID": "test",
			    "productID": "disneystorytime-pt"
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

	Scenario:  Sign legal without deviceID
		When I do call "POST" request to "/appuser/legalsigned" with body:
			"""
			{
			    "appUserID": "test",
			    "productID": "disneystorytime-pt"
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

	Scenario:  Sign legal without productID
		When I do call "POST" request to "/appuser/legalsigned" with body:
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

	Scenario:  Sign legal with wrong format productID
		When I do call "POST" request to "/appuser/legalsigned" with body:
			"""
			{
			    "appUserID": "test",
			    "deviceID": "test",
			    "productID": "disneystorytimept"
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

