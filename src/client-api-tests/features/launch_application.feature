Feature: client.api: Launch application
	@test1
	@notAllowedForProd
	@after-removeDeviceIdFromDynamoDB
	@after-removeInstallationFromDynamoDB
	@after-removeSessionFromDynamoDB
	@after-removeDeviceFromDynamoDB
	Scenario: Do valid launch application with new user
		When I do call "POST" request to "/appuser/launchapplication" for launch application with body:
			"""
			{
			  "appUserID": "",
			  "productID": "disneystorytime",
			  "deviceID": "auto-test-launch-application-deviceID",
			  "appVersion": "1.0",
			  "deviceOS": "android-8",
			  "platform": "android",
			  "deviceModel": "Samsung S6"
			}
			"""
		Then I receives status code "200"
		And The response should contain:
			"""
			{
			"productID": "disneystorytime-pt",
			"deviceID": "auto-test-launch-application-deviceID",
			"userType": 0
			}
			"""

	@notAllowedForProd
	@after-removeDeviceIdFromDynamoDB
	@after-removeInstallationFromDynamoDB
	@after-removeSessionFromDynamoDB
	@after-removeDeviceFromDynamoDB
	Scenario: Do launch application with empty appUserID but already existed user
		Given I launch application
		When I do call "POST" request to "/appuser/launchapplication" for launch application with body:
			"""
			{
			  "appUserID": "",
			  "productID": ${user.productID},
			  "deviceID": ${user.deviceID},
			  "appVersion": "1.0",
			  "deviceOS": "android-8",
			  "platform": "android",
			  "deviceModel": "Samsung S6"
			}
		    """
		Then I receives status code "200"
		And The response should contain:
			"""
			{
			  "deviceID": ${user.deviceID},
			  "productID": ${user.productID},
			  "appUserID": ${user.appUserID}
			}
			"""


	@notAllowedForProd
	@after-removeDeviceIdFromDynamoDB
	@after-removeInstallationFromDynamoDB
	@after-removeSessionFromDynamoDB
	@after-removeDeviceFromDynamoDB
	Scenario: Do launch application with appUserID and existed user
		Given I launch application
		When I do call "POST" request to "/appuser/launchapplication" for launch application with body:
			"""
			{
			  "appUserID": ${user.appUserID},
			  "productID": ${user.productID},
			  "deviceID": ${user.deviceID},
			  "appVersion": "1.0",
			  "deviceOS": "android-8",
			  "platform": "android",
			  "deviceModel": "Samsung S6"
			}
		    """
		Then I receives status code "200"
		And The response should contain:
			"""
			{
			  "appUserID": ${user.appUserID},
			  "deviceID": ${user.deviceID},
			  "productID": ${user.productID}
			}
			"""


	Scenario: Do launch application without productID
		When I do call "POST" request to "/appuser/launchapplication" for launch application with body:
			"""
			{
				"appUserID": "",
			  "deviceID": "test",
			  "appVersion": "1.0",
			  "deviceOS": "android-8",
			  "platform": "android",
			  "deviceModel": "Samsung S6"
			}
		    """
		Then I receives status code "200"
		And The response should contain:
			"""
			{
			  "status": "Bad Request",
			  "statusCode": 400
			}
			"""

	Scenario: Do launch application without deviceID
		When I do call "POST" request to "/appuser/launchapplication" for launch application with body:
			"""
			{
				"appUserID": "",
			  "productID": "test",
			  "appVersion": "1.0",
			  "deviceOS": "android-8",
			  "platform": "android",
			  "deviceModel": "Samsung S6"
			}
		    """
		Then I receives status code "200"
		And The response should contain:
			"""
			{
			  "status": "Bad Request",
			  "statusCode": 400
			}
			"""


	Scenario: Do launch application without appVersion
		When I do call "POST" request to "/appuser/launchapplication" for launch application with body:
			"""
			{
				"appUserID": "",
			  "productID": "test",
			  "deviceID": "test",
			  "deviceOS": "android-8",
			  "platform": "android",
			  "deviceModel": "Samsung S6"
			}
		    """
		Then I receives status code "200"
		And The response should contain:
			"""
			{
			  "status": "Bad Request",
			  "statusCode": 400
			}
			"""

	Scenario: Do launch application without deviceOS
		When I do call "POST" request to "/appuser/launchapplication" for launch application with body:
			"""
			{
				"appUserID": "",
			  "productID": "test",
			  "deviceID": "test",
			  "appVersion": "1.0",
			  "platform": "android",
			  "deviceModel": "Samsung S6"
			}
		    """
		Then I receives status code "200"
		And The response should contain:
			"""
			{
			  "status": "Bad Request",
			  "statusCode": 400
			}
			"""

	Scenario: Do launch application without platform
		When I do call "POST" request to "/appuser/launchapplication" for launch application with body:
			"""
			{
				"appUserID": "",
			  "productID": "test",
			  "deviceID": "test",
			  "appVersion": "1.0",
			  "deviceOS": "android-8",
			  "deviceModel": "Samsung S6"
			}
		    """
		Then I receives status code "200"
		And The response should contain:
			"""
			{
			  "status": "Bad Request",
			  "statusCode": 400
			}
			"""

	Scenario: Do launch application without deviceModel
		When I do call "POST" request to "/appuser/launchapplication" for launch application with body:
			"""
			{
				"appUserID": "",
			  "productID": "test",
			  "deviceID": "test",
			  "appVersion": "1.0",
			  "deviceOS": "android-8",
			  "platform": "android"
			}
		    """
		Then I receives status code "200"
		And The response should contain:
			"""
			{
			  "status": "Bad Request",
			  "statusCode": 400
			}
			"""

