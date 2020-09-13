Feature: client.api: Signup with email
	@notAllowedForProd
	@after-removeDeviceIdFromDynamoDB
	@after-removeProgressFromDynamoDB
	Scenario: Do Signup with email
		Given I launch application
		Given I clean extra tables data
		Given I send IAPReceipt
		When I do call "POST" request to "/appuser/signup" for login with body:
			"""
			{
			"productID": ${user.productID},
			"deviceID": ${user.deviceID},
			"appUserID": ${user.appUserID},
			"registrationType": 1,
			"email":"fiatlux@gmail.com",
			"password":"12345678"
			}
			"""
		Then I receives status code "200"
		And The response should contain:
			"""
			{
			"productID": "disneystorytime-pt",
			"deviceID": ${user.deviceID},
			"appUserID": ${user.appUserID},
			"isSucceeded": 1,
			"userType": 1
			}
			"""
