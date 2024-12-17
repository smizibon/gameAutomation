Feature: Flarie Game Testing
    As a user
    I want to access the Flarie game
    So that I can verify all game elements load correctly

    Scenario: Open Flarie game page and verify elements
        Given I am on the Flarie game website
        When the page loads completely
        Then I should see the game interface 
        And the leaderboard should be ranked "before game"
        When I click the Start Game button and wait for 3 seconds
        And I enter the email and username and submit the form
        And I perform the game clicks sequence
        Then the leaderboard should be ranked "after game"