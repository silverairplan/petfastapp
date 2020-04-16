import * as firebase from 'firebase';

export class Service
{
    getServiceInfo(callback)
    {
        var database = firebase.database();

        database.ref('services').on('value', snapshot => 
        {
            snapshot.forEach(item => {
                
                var obj_ = item.val();
                obj_.key = item.key;
                callback(obj_);
            });
        });
    }

    getServiceByID(serviceID, callback)
    {
        var database = firebase.database();

        var ref = database.ref('services/' + serviceID);
        ref.on('value', (snapshot) =>
        {
            var obj_ = snapshot.val();
            obj_.key = snapshot.key;

            window.console.log("service ", obj_);
            callback(obj_);
        });
        
        
    }
}