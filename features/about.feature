Feature: FashionHub About Page

  As a visitor
  I want to learn about FashionHub
  So that I can understand the company's story and values

  Background:
    Given I am on the About page

  Scenario: Smoke — About page loads with correct title
    Then the page title contains "About"

  Scenario: Main heading is visible
    Then I see the heading "About FashionHub"

  Scenario: All expected subsections are present
    Then the page contains subsection headings

  Scenario: Page contains descriptive content paragraphs
    Then the about section has descriptive content
