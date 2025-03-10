const BASE_URL = 'http://localhost:8000';
let mode = 'CREATE'; //default mode
let selectid = '';

window.onload = async() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    console.log('id', id);
    if (id) {
        mode = 'EDIT';
        selectid = id;

        //1. เราจะดึงข้อมูลของ user ที่ต้องการแก้ไข
        try{
            const response = await axios.get(`${BASE_URL}/users/${id}`);
            console.log('response', response.data);
            const user = response.data;

            //2. เราจะนำข้อมูลของ user ที่ดึงมา ใส่ใน input ที่เรามี
            let firstNameDOM = document.querySelector('input[name=firstname]');
            let lastNameDOM = document.querySelector('input[name=lastname]');
            let ageDOM = document.querySelector('input[name=age]');
            let genderDOM = document.querySelector('input[name=gender]:checked');
            let descriptionDOM = document.querySelector('textarea[name=description]');
            let messageDOM = document.getElementById('message');

            firstNameDOM.value = user.firstName;
            lastNameDOM.value = user.lastName;
            ageDOM.value = user.age
            descriptionDOM.value = user.description;

            let genderDOMs = document.querySelectorAll('input[name=gender]');
            let interestDOMs = document.querySelectorAll('input[name=interest]');

            for (let i = 0; i < genderDOMs.length; i++) {
                if (genderDOMs[i].value == user.gender) {
                    genderDOMs[i].checked = true;
                }
            }
            for (let i = 0; i < interestDOMs.length; i++) {
                if(user.interests.includes(interestDOMs[i].value)) {
                    interestDOMs[i].checked = true;
                }
            }

        } catch (error) {
            console.log('error', error);
        }
    }
}

const validateData = (userData) => {
    let errors = [];

    if (!userData.firstName) {
        errors.push('กรุณากรอกชื่อ');
    }
    if (!userData.lastName) {
        errors.push('กรุณากรอกนามสกุล');
    }
    if (!userData.age) {
        errors.push('กรุณากรอกอายุ');
    }
    if (!userData.gender) {
        errors.push('กรุณาเลือกเพศ');
    }
    if (!userData.interests) {
        errors.push('กรุณาเลือกความสนใจ');
    }
    if (!userData.description) {
        errors.push('กรุณากรอกคำอธิบาย');
    }
    return errors;
};

const submitData = async () => {
    let firstNameDOM = document.querySelector('input[name=firstname]');
    let lastNameDOM = document.querySelector('input[name=lastname]');
    let ageDOM = document.querySelector('input[name=age]');
    let genderDOM = document.querySelector('input[name=gender]:checked') || {};
    let interestDOMs = document.querySelectorAll('input[name=interest]:checked') || [];
    let descriptionDOM = document.querySelector('textarea[name=description]');
    let messageDOM = document.getElementById('message');

    try {
        let interest = Array.from(interestDOMs).map(i => i.value).join(',');

        let userData = {
            firstName: firstNameDOM.value,  
            lastName: lastNameDOM.value,
            age: ageDOM.value,
            gender: genderDOM.value,
            interests: interest,
            description: descriptionDOM.value
        };

        console.log("submitData", userData);
/*
        const errors = validateData(userData);
        if (errors.length > 0) {
            throw {
                message: 'กรุณากรอกข้อมูลให้ครบถ้วน',
                errors: errors
            };
        }
*/
        let message = 'บันทึกข้อมูลเรียบร้อย';
        if (mode == 'CREATE') {
            const response = await axios.post(`${BASE_URL}/users/${selectid}`, userData);
            console.log('response', response.data);
        }else{
            const response = await axios.put(`${BASE_URL}/users/${selectid}`, userData);
            message = 'แก้ไขข้อมูลเรียบร้อย';
            console.log('response', response.data);
        }
        
        messageDOM.innerText = message;
        messageDOM.className = 'message success';
    } catch (error) {
        let htmlData = '<div>';
        htmlData += `<div> ${error.message} </div>`;
        htmlData += '<ul>';

        if (error.response) {
            console.log(error.response);
            error.message = error.response.data.message;
            error.errors = error.response.data.errors;
        }

        htmlData += '</ul>';
        htmlData += '</div>';
        
        messageDOM.innerText = 'เกิดข้อผิดพลาดในการบันทึกข้อมูล';
        messageDOM.className = 'message danger';
    }
};