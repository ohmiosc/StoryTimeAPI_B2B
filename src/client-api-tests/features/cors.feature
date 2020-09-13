@CORS
Feature: client.api: CORS

  Scenario Outline: Do API calls and check the response header
    When I do call "<method>:<path>" with data:
      """
      { }
      """
    Then I receives status code "200"
    And Header contains key "Access-Control-Allow-Origin" and value "*"
    And Header contains key "x-amz-apigw-id"

    Examples:
      | method | path                      |
      | POST   | /appuser/edituser         |
      | POST   | /appuser/validate         |
      | POST   | /appuser/validatepassword |
