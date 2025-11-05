import bcrypt from 'bcryptjs';
import {} from 'express';
export const signUpController = (model) => {
    return (async function (req, res) {
        const { username, email, password } = req.body;
        try {
            const isPresent = await model.findOne({ email });
            if (!isPresent) {
                const salt = await bcrypt.genSalt(10);
                const hashed = await bcrypt.hash(password, salt);
                const new_user = new model({ username, email, password: hashed });
                await new_user.save();
                return res.status(200).json({ msg: "user created" });
            }
            throw Error(" user exists");
        }
        catch (err) {
            console.log(err);
            return res.status(400).json({ msg: "unsuccessful" });
        }
    });
};
