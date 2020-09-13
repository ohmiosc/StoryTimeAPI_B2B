Feature: client.api: Get app user By ID
	@notAllowedForProd
	@after-removeDeviceIdFromDynamoDB
	Scenario: Get application user
		Given I launch application
		Given I clean extra tables data
		When I do call "POST" request to "/appuser" with body:
			"""
			{
			"appUserID": ${user.appUserID}
			}
			"""
		Then I receives status code "200"
		And The response should contain:
			"""
			{
			"appUserID": ${user.appUserID},
			"deviceID": ${user.deviceID},
			"userType": ${user.userType}
			}
			"""
