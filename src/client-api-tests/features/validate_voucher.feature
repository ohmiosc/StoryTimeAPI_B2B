Feature: client.api: Validate Voucher
  @notAllowedForProd
  @after-removeDeviceIdFromDynamoDB
  Scenario: Do invalid voucher validation
    Given I launch application
    Given I clean extra tables data
    When I do call "POST" request to "/appuser/voucher" with body:
			"""
			{
			"productID": ${user.productID},
			"deviceID": ${user.deviceID},
			"appUserID": ${user.appUserID},
			"MSISDN": "44444450013",
			"operatorName": "xl",
			"platform": "ios",
			"voucher": "test"
			}
			"""
    Then I receives status code "200"
    And The response should contain:
			"""
			{
			"message": "Voucher test is not valid",
			"productID": "disneystorytime-pt",
			"deviceID": ${user.deviceID},
			"isSucceeded": 0,
			"userType": 0,
			"failureReason": 31,
			"statusCode": 200,
            "status": "OK"
			}
			"""
  @notAllowedForProd
  @after-removeDeviceIdFromDynamoDB
  Scenario: Do voucher validation with non-existing user
    Given I launch application
    Given I clean extra tables data
    When I do call "POST" request to "/appuser/voucher" with body:
			"""
			{
			"productID": ${user.productID},
			"deviceID": ${user.deviceID},
			"appUserID": "non-existing",
			"MSISDN": "44444450013",
			"operatorName": "xl",
			"platform": "ios",
			"voucher": "test"
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

  @notAllowedForProd
  @after-removeDeviceIdFromDynamoDB
  Scenario: Do voucher validation without productID
    When I do call "POST" request to "/appuser/voucher" with body:
			"""
			{
			"deviceID": "test",
			"appUserID": "test",
			"MSISDN": "44444450013",
			"operatorName": "xl",
			"platform": "ios",
			"voucher": "test"
			}
			"""
    Then I receives status code "200"
    And The response should contain:
			"""
			{
            "message": "Validation failed:: productID is required",
            "statusCode": 400,
            "status": "Bad Request"
			}
			"""

  @notAllowedForProd
  @after-removeDeviceIdFromDynamoDB
  Scenario: Do voucher validation without appUserID
    When I do call "POST" request to "/appuser/voucher" with body:
			"""
			{
			"productID": "test",
			"deviceID": "test",
			"MSISDN": "44444450013",
			"operatorName": "xl",
			"platform": "ios",
			"voucher": "test"
			}
			"""
    Then I receives status code "200"
    And The response should contain:
			"""
			{
            "message": "Validation failed:: appUserID is required",
            "statusCode": 400,
            "status": "Bad Request"
			}
			"""

  @notAllowedForProd
  @after-removeDeviceIdFromDynamoDB
  Scenario: Do voucher validation without operatorName
    When I do call "POST" request to "/appuser/voucher" with body:
			"""
			{
			"appUserID": "test",
			"productID": "test",
			"deviceID": "test",
			"MSISDN": "44444450013",
			"platform": "ios",
			"voucher": "test"
			}
			"""
    Then I receives status code "200"
    And The response should contain:
			"""
			{
            "message": "Validation failed:: operatorName is required",
            "statusCode": 400,
            "status": "Bad Request"
			}
			"""

  @notAllowedForProd
  @after-removeDeviceIdFromDynamoDB
  Scenario: Do voucher validation without MSISDN
    When I do call "POST" request to "/appuser/voucher" with body:
			"""
			{
			"appUserID": "test",
			"productID": "test",
			"deviceID": "test",
			"operatorName": "xl",
			"platform": "ios",
			"voucher": "test"
			}
			"""
    Then I receives status code "200"
    And The response should contain:
			"""
			{
            "message": "Validation failed:: MSISDN is required",
            "statusCode": 400,
            "status": "Bad Request"
			}
			"""

  @notAllowedForProd
  @after-removeDeviceIdFromDynamoDB
  Scenario: Do voucher validation without voucher
    When I do call "POST" request to "/appuser/voucher" with body:
			"""
			{
			"appUserID": "test",
			"productID": "test",
			"deviceID": "test",
			"operatorName": "xl",
			"MSISDN": "test",
			"platform": "ios"
			}
			"""
    Then I receives status code "200"
    And The response should contain:
			"""
			{
            "message": "Validation failed:: voucher is required",
            "statusCode": 400,
            "status": "Bad Request"
			}
			"""

  @notAllowedForProd
  @after-removeDeviceIdFromDynamoDB
  Scenario: Do voucher validation with wrong operator's name
    When I do call "POST" request to "/appuser/voucher" with body:
			"""
			{
			"appUserID": "test",
			"productID": "test",
			"deviceID": "test",
			"operatorName": "wrong_name",
			"MSISDN": "test",
			"platform": "ios",
			"voucher": "test"
			}
			"""
    Then I receives status code "200"
    And The response should contain:
			"""
			{
            "message": "Wrong operator name. Should be xl.",
            "statusCode": 400,
            "status": "Bad Request"
			}
			"""
