const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const db = require('../models/dbConfig')
const { promisify } = require('util')

exports.register = (req, res) => {
    const { name, email, password, cofirmPassword } = req.body
    db.dbConnection.query('SELECT email FROM users WHERE email = ?', [email], async (err, result) => {
        if (err) {
            console.log(err)
        }
        if (result.length > 0) {
            return res.render('Register', {
                message: 'Email already Exist'
            })
        } else if (password !== cofirmPassword) {
            return res.render('Register', {
                message: 'Passwords do not Match'
            })
        }
        let hashedPassword = await bcrypt.hash(password, 10)

        db.dbConnection.query('INSERT INTO users SET ?', { name: name, email: email, password: hashedPassword }, (err, results) => {
            if (err) {
                console.log(err)
            } else {
                db.dbConnection.query('SELECT id FROM users WHERE email = ?', [email], (error, result) => {
                    const id = result[0].id;
                    console.log(id);
                    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
                        expiresIn: "1h"
                    })
                    /** Important Cookies Security:
                         * httpOnly : clientSide cant apply js to the cookie to prevent (XSS)
                         * sameSite: protect from cross-site request forgery attacks 
                    */
                    const cookieOptions = {
                        expires: new Date(
                            Date.now() + 60 * 60 * 1000
                        ),
                        httpOnly: true,
                        sameSite: true
                    }
                    res.cookie('jwt', token, cookieOptions)

                    res.status(201).redirect("/login")
                });
            }
        })
    })

}

exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).render("Login", {
            message: 'Please provide email and password'
        });
    }

    db.dbConnection.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
        console.log(results);
        console.log(password);
        const isMatch = await bcrypt.compare(password, results[0].password);
        console.log(isMatch);
        if (!results || !isMatch) {
            return res.status(401).render("Login", {
                message: 'Incorrect email or password'
            });
        } else {
            const id = results[0].id;
            console.log(id);
            const token = jwt.sign({ id }, process.env.JWT_SECRET, {
                expiresIn: '1h'
            });

            const cookieOptions = {
                expires: new Date(
                    Date.now() + 60 * 60 * 1000
                ),
                httpOnly: true,
                sameSite: true
            };
            res.cookie('jwt', token, cookieOptions);

            res.status(200).redirect("/profile");
        }
    });
};

exports.isLoggedIn = async (req, res, next) => {
    console.log(req.cookies);
    if (req.cookies.jwt) {
        try {
            // verify token
            const decoded = await promisify(jwt.verify)(
                req.cookies.jwt,
                process.env.JWT_SECRET
            );

            console.log("decode: ", decoded);

            // Check if user still exists
            db.dbConnection.query('SELECT * FROM users WHERE id = ?', [decoded.id], (error, result) => {
                console.log(result)
                if (!result) {
                    return next();
                }
                req.user = result[0];
                return next();
            });
        } catch (err) {
            return next();
        }
    } else {
        next();
    }
};

exports.logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
        sameSite: true
    });
    res.status(200).redirect("/");
};