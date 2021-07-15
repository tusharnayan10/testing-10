const express = require('express')
const app = express();
const bodyParser = require('body-parser')
const connectDB = require('./db')
const path = require('path')
const Input = require('./models/Input')
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const { getMaxListeners } = require('./models/Input');
app.set('view engine', 'hbs')
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
connectDB()

app.get('/', (req, res) => res.render("input"))


app.post('/in', async (req, res) => {
    const { name, section, location, equip_no, equip_des, equip_type, range, accuracy, frequency, lastdate, duedate, intidays, status, remarks } = req.body
    const newInput = new Input({
        plant: name,
        section,
        location,
        equip_no,
        equip_des,
        equip_type,
        range,
        accuracy,
        frequency,
        lastdate,
        duedate,
        intidays,
        status,
        remarks
    })
    newInput.save().then((inp) => console.log("Data Saved")).catch(err => console.error(err))


    console.log(duedate);
    //email options
    const mailOptions = {
        from: 'preetismit75@gmail.com',
        to: 'daspreeti1609@gmail.com',
        subject: 'Email from Node-js app',
        text: 'Your Due date is in ${12}'
    };

    //email transport configuration
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'preetismit75@gmail.com',
            pass: 'Preeti@123'
        }
    });

    //send email

    // cron.schedule(' * * * * * ', () => {
    //     transporter.sendMail(mailOptions, (error, info) => {
    //         if(error) {
    //             console.log(error);
    //         }
    //         else {
    //             console.log('email send' + info.response);
    //         }
    //     });
    // })
    res.render('saved')
})

const CurrentDate = new Date();

app.get('/display', async (req, res) => {
    // const resp = await Input.find();
    // Case 1: (duedate>=currentData)
    // const resp = await Input.find({ "duedate": { $gte: `${CurrentDate}` } });
    // Case 2: (duedate<=currentData)
    const resp = await Input.find({ "duedate": { $lte: `${CurrentDate}` } });
    // let -> Return less than and equal to
    // gte -> Return greater than and equalto
    // gt -> Returns greater
    // le -> Returns less
    // if duedate is >= current data

    let display = ''
    resp.forEach(({ plant, section, location, equip_no, equip_des, equip_type, range, accuracy, frequency, lastdate, duedate, intidays, status, remarks }) => {

        display += `
        <tr>
            <th>${plant}</th>
            <th>${section}</th>
            <th>${location}</th>
            <th>${equip_no}</th>
            <th>${equip_des}</th>
            <th>${equip_type}</th>
            <th>${range}</th>
            <th>${accuracy}</th>
            <th>${frequency}</th>
            <th>${lastdate}</th>
            <th>${duedate}</th>
            <th>${intidays}</th>
            <th>${status}</th>
            <th>${remarks}</th>
        </tr>
        `




    })
    res.render('display', { display })
})





app.use('/input', require('./routes/input.js'))
const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server Running on PORT ${PORT}`))