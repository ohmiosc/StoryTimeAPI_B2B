Feature: client.api: Check Session
  @notAllowedForProd
  @after-removeDeviceIdFromDynamoDB
  @after-removeInstallationFromDynamoDB
  @after-removeSessionFromDynamoDB
  @after-removeDeviceFromDynamoDB
  Scenario: Check Session when guest user is created
    Given I launch application
    Then Item in "Session" table with "SessionID" should not be empty
    And  Item in "AppUser" table with "AppUserID" should not be empty



