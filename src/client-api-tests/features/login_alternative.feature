Feature: client.api: Login alternative

	@notAllowedForProd
	@after-removeDeviceIdFromDynamoDB
	Scenario: Do login alternative for active Vivo user
		Given I launch application
		Given I clean extra tables data
		When I do call "POST" request to "/appuser/loginalternative" for login with body:
			"""
			{
			"productID": ${user.productID},
			"deviceID": ${user.deviceID},
			"appUserID": ${user.appUserID},
			"MSISDN": "44444450013",
			"operatorName": "Vivo"
			}
			"""
		Then I receives status code "200"
		And The response should contain:
			"""
			{
			"productID": "disneystorytime-pt",
			"deviceID": ${user.deviceID},
			"isSucceeded": 1,
			"userType": 4,
			"failureReason": 0
			}
			"""

	@notAllowedForProd
	@after-removeDeviceIdFromDynamoDB
	Scenario: Do login alternative for canceled Vivo user
		Given I launch application
		Given I clean extra tables data
		When I do call "POST" request to "/appuser/loginalternative" for login with body:
			"""
			{
			"productID": ${user.productID},
			"deviceID": ${user.deviceID},
			"appUserID": ${user.appUserID},
			"MSISDN": "50000000002",
			"operatorName": "Vivo"
			}
			"""
		Then I receives status code "200"
		And The response should contain:
			"""
			{
			"productID": ${user.productID},
			"deviceID": ${user.deviceID},
			"isSucceeded": 0,
			"userType": 5,
			"failureReason": 6
			}
			"""
			
	@notAllowedForProd
	@after-removeDeviceIdFromDynamoDB
	Scenario: Do login alternative for disabled Vivo user
		Given I launch application
		Given I clean extra tables data
		When I do call "POST" request to "/appuser/loginalternative" for login with body:
			"""
			{
			"productID": ${user.productID},
			"deviceID": ${user.deviceID},
			"appUserID": ${user.appUserID},
			"MSISDN": "50000000003",
			"operatorName": "Vivo"
			}
			"""
		Then I receives status code "200"
		And The response should contain:
			"""
			{
			"productID": ${user.productID},
			"deviceID": ${user.deviceID},
			"isSucceeded": 0,
			"userType": 6,
			"failureReason": 7
			}
			"""
