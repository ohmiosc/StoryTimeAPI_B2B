Feature: client.api: Check Device
  @notAllowedForProd
  @after-removeDeviceIdFromDynamoDB
  @after-removeInstallationFromDynamoDB
  @after-removeSessionFromDynamoDB
  @after-removeDeviceFromDynamoDB
  Scenario: Check Session when guest user is created
    Given I launch application
    Then Item in "Device" table with "deviceID" should not be empty



