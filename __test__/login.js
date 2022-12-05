const axios = require('axios');

const login=  async ()=>{
    const response= async(email, password)=>{
        try{
            const res= await axios({
                method: 'POST',
                url: '/api/v1/users/login',
                data: {
                    email,
                    password
                },
    
            });
    
        }catch(err){
            console.log(err)
        }
    };

    return response.data.results
};

module.exports= login; 