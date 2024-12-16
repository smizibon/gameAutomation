Feature: Flarie Game Testing
    As a user
    I want to access the Flarie game
    So that I can verify all game elements load correctly

    Scenario: Open Flarie game page and verify elements
        Given I am on the Flarie game website
        When the page loads completely
        Then I should see the game interface 