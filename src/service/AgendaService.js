
import * as firebase from 'firebase';
import { PetService } from './PetService';
import { Service } from './Service';


export class AgendaService
{

    getAgendaList(userID, callback)
    {
        var database = firebase.database();
        var petservice = new PetService();
        var serviceService = new Service();

        database.ref('userservice').orderByChild("userid").equalTo(userID)
            .on('value', snapshot => 
        {
            snapshot.forEach(item => 
                {
                    _obj = item.val();

                    if(_obj.cancelledon)
                    {
                        return;
                    }

                    _obj.key = item.key;
                    _obj.petsList = [];
                    _obj.serviceList = [];
                    
                    //pets
                    _obj.pets.forEach(petID => 
                        {
                            petservice.getPetByID(petID, (petobj) =>
                            {
                                _obj.petsList.push(petobj);
                            });
                        });
                    
                    //services
                    _obj.services.forEach(serviceID => 
                        {
                            serviceService.getServiceByID(serviceID, (srv) =>
                            {
                                _obj.serviceList.push(srv);
                            });
                        });
                    
                    callback(_obj);
                });
        });
    }

}