import * as firebase from 'firebase';


export class PetService
{

    /**this method must be refactored to get pets by its ID.
     * In user object, we must set the pet id list for the user
     */
    getPets(userID, callback)
    {
        var database = firebase.database();

        database.ref('pet').on('value', snapshot => 
        {
            snapshot.forEach(item => 
            {
                var obj_ = item.val();
                obj_.key = item.key;
                
                if(obj_.userid && obj_.userid == userID)
                {
                    callback(obj_);
                }
            });
        });
    }

    getPetByID(petID, callback)
    {
        var database = firebase.database();

        database.ref('pet/' + petID).on('value', snapshot => 
        {
            var pet = snapshot.val();
            pet.key = snapshot.key;
            callback(pet);
        });
    }
}