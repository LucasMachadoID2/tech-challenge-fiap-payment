Feature: Payment Creation
  As an API client
  I want to create a new payment

  Scenario: Successful payment creation
    Given I have valid payment data
    When I send a POST request to "/payments"
    Then I should receive a response with status 201