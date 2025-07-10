
CREATE OR REPLACE PROCEDURE get_users_by_gender(IN gender_filter VARCHAR(20))
AS $$
BEGIN
    SELECT * FROM users WHERE gender = gender_filter ORDER BY date_added DESC;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE count_users_by_occupation(IN occupation_filter VARCHAR(100))
AS $$
BEGIN
    SELECT COUNT(*) AS user_count FROM users WHERE occupation = occupation_filter;
END;
$$ LANGUAGE plpgsql;