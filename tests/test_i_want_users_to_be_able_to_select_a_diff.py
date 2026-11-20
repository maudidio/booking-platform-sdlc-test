import unittest

from feature import i_want_users_to_be_able_to_select_a_diff


class TestIWantUsersToBeAbleToSelectADiff(unittest.TestCase):
    # AC-1: Given the application, When a user uses the translations capability, Then it behaves as de
    # AC-2: Given invalid input, When a user uses the translations capability, Then a clear error is r

    def test_ac_1_i_want_users_to_be_able_to_select_a_diff(self):
        self.assertEqual(i_want_users_to_be_able_to_select_a_diff(1, 2), (1, 2)


if __name__ == "__main__":
    unittest.main()
