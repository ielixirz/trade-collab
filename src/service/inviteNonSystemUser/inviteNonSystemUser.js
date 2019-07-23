import { from } from 'rxjs';
import { FirebaseApp } from '../firebase';

const NonUserInviteRefPath = () => FirebaseApp.firestore().collection('NonUserInvite');

/* ex CreateNonUserInvite

    {
        ShipmentKey (string)
        ChatRoomKey (string)
        CompanyKey (string)
        NonUserInviteEmail (string)
        NonUserInviteRecruiterUserKey (string)
        NonUserInviteRecruiterProfileKey (string)
        NonUserInviteRecruiterProfileFirstName (string)
        NonUserInviteRecruiterProfileSurName (string)
    }

*/

// eslint-disable-next-line import/prefer-default-export
export const CreateNonUserInvite = Data => from(NonUserInviteRefPath().add(Data));
