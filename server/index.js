const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const port = 8000;

app.use(bodyParser.json());

let users = []
let counter = 1
    
/*
GET /user แสดงข้อมูล user ทั้งหมดที่บันทึกไว้
POST /user สร้างข้อมูล user ใหม่บันทึกเข้าไป
GET /user/:id ดึงข้อมูล user รายคนออกมา
PUT /user/:id แก้ไขข้อมูล user รายคน (ตามidที่บันทึกเข้าไป)
DELETE /user/:id ลบข้อมูล user รายคน (ตามidที่บันทึกเข้าไป)
*/

//paht:/user ใช้สำหรับแสดงข้อมูล user ทั้งหมด
app.get('/user', (req, res) => {
   res.json(users);
   
})
//path:/user ใช้สำหรับสร้างข้อมูย user ใหม่
app.post('/user', (req, res) => {
    let user = req.body;
    user.id = counter
    counter += 1
    users.push(user);
    res.json({
        message: 'Create new user successfully',
        user: user
    });
})
// path:PUT /user/:id ใช้สำหรับแสดงข้อมูล user ตาม id ที่ระบุ
app.put('/user/:id', (req, res) => {
    let id = req.params.id;
    let updateUser = req.body;
    //หา users จาก id ที่ส่งมา
    let selectIndex = users.findIndex(user =>  user.id == id)
    
    //แก้ไขข้อมูล user ที่เจอ
    if(updateUser.firstname){
        users[selectIndex].firstname = updateUser.firstname
    }
    if(updateUser.lastname){
        users[selectIndex].lastname = updateUser.lastname
    }
    res.json({
        message: 'Update user successfully',
        data:{
        user: updateUser,
        indexUpdate: selectIndex
        }
    })

})
//path:DELETE /user/:id ใช้สำหรับลบข้อมูล user ตาม id ที่ระบุ
app.delete('/user/:id', (req, res) => {
    let id = req.params.id;
    //หา index ของ user ที่ต้องการลบ
    let selectIndex = users.findIndex(user =>  user.id == id)

    //ลบ 
    users.splice(selectIndex, 1)
    res.json({
        message: 'Delete user successfully',
        indexDelete: selectIndex
    })
})
app.listen(port, (req, res) => {
    console.log('Http server is running on port ' + port);
});