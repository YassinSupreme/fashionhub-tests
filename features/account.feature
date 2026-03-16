Feature: FashionHub Account Page

  As a registered user
  I want to access my account page
  So that I can view my details and manage my session

  Scenario: Authenticated user sees welcome message
    Given I am logged in as a valid user
    Then I see a welcome message with my username

  Scenario: Logout button is visible when logged in
    Given I am logged in as a valid user
    Then the Logout button is visible

  Scenario: Clicking Logout navigates away from account
    Given I am logged in as a valid user
    When I click the Logout button
    Then I am no longer on the Account page

  Scenario: Unauthenticated user does not see welcome message
    Given I am on the Account page without logging in
    Then I do not see a welcome message
