import * as firebase from 'firebase';
import '@firebase/firestore';
import { AsyncStorage } from 'react-native';


export class UserService
{

    //validate if user exists by uid
    validadeUserExistsByFacebookId(uid, callback)
    {
        if(!uid)
            return false;
        
        let query = firebase.database().ref("user").orderByChild("uid").equalTo(uid);
        query.on('value', snapshot => {
            if(snapshot.exists())
                callback(true);
            else
                callback(false);
        });
    }

    getUserDatabaseID(uid, callback)
    {
        if(!uid == uid === "") 
        {
            callback("");
            return;
        }

        let query = firebase.database().ref("user").orderByChild("uid").equalTo(uid);
        query.on('value', snapshot =>
        {
            if(snapshot.exists())
                callback(Object.keys(snapshot.val())[0]);
            else
                callback("");
        });
    }

    createUerFacebook(name, profilePicture, uid, email, phone, callback)
    {
        const db = firebase.database();
        db.ref("user").push(
            {
                cpf: "",
                email: email,
                name: name,
                phone: phone,
                uid: uid,
                profilePicture: profilePicture
            }
        )
        .then(() => 
        {
            this.getUserDatabaseID(uid, callback);
        })
        .catch(err => 
            {
                window.console.log("ao criar user",err);
            });
        }

    async getUserID()
    {
        var userid = await AsyncStorage.getItem("userid");
        return userid;
    }

    async saveUserID(id)
    {
        
        await AsyncStorage.setItem('userid',"" + id);
    }

    //set user as logged
    async setUserLogged(userID)
    {
        await AsyncStorage.setItem("userid", userID);
    }

    //validate if user is logged
    async checkIsUserLoggedAsync()
    {
        storageUserID = await AsyncStorage.getItem("userid");
        return storageUserID !== null;
    }

    logoutUser(navigator)
    {
        //clear all storage
        
        AsyncStorage.clear();
        navigator.immediatelyResetStack([Router.getRoute('login')], 0);
    }

    createUserFirebase(cpf, name, email, password, phone)
    {

        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(result => 
                {
                    const db = firebase.database();
                    db.ref("user").push(
                        {
                            cpf: cpf,
                            email: email,
                            name: name,
                            phone: phone,
                            uid: result.user.uid,
                            profilePicture: ""
                        }
                    )
                    return true;
                })
            .catch(err => 
                {
                    return false;
                });
    }
    
    async isUserValidFirebase(email, password)
    {
        const result = await firebase.auth().signInWithEmailAndPassword(email, password)
            .then(a => 
                {
                    window.console.log("achou o e-mail e senha");
                    return a.user.uid;
                })
            .catch(err => 
                {
                    window.console.log("nao achou o e-mail e senha");
                    return "";
                });

        window.console.log("retornou  ", result);
        return result;
    }


    //validate if email already exists
    async emailExists(email)
    {    
        window.console.log("email", email);
        if(!email || email.length == 0)
            return false;

        var emailexists = false;
        const db = firebase.database();
        const result = await db.ref("user").orderByChild("email").equalTo(email)
                            .once("value", snapshot => 
                            {
                                emailexists = snapshot.exists();
                            });

        return emailexists;
    }

    sendPasswordResetEmail(email)
    {
        firebase.auth().sendPasswordResetEmail(email);
    }


    getUserAddress(userID, callback)
    {
        const db = firebase.database();
        db.ref("address").on('value',snapshot => 
        {
            snapshot.forEach(item => 
            {
                let _obj = item.val();
                _obj.key = item.key;

                if (_obj.userid == userID)
                    callback(_obj);
            });
        });
    }

}