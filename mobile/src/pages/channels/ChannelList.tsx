import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonAccordionGroup, IonItem, IonLabel, IonIcon, IonAccordion, IonList } from '@ionic/react'
import { addOutline } from 'ionicons/icons';
import { IoAdd } from 'react-icons/io5'
import React, { useEffect, useRef } from 'react'
import { Channels } from '../../components/features/ChannelList';

type Props = {}

export const ChannelList = (props: Props) => {

    return (
        <IonPage>
            <IonHeader translucent>
                <IonToolbar>
                    <IonTitle>Raven</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                <IonHeader collapse="condense" translucent>
                    <IonToolbar>
                        <IonTitle size="large">Raven</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <div className='ion-padding-horizontal py-2'>
                    <IonLabel className='text-sm font-medium' color='medium'>Channels</IonLabel>
                </div>
                <Channels />
                <IonItem>
                    <div slot='start'>
                        <IoAdd size='24' color='var(--ion-color-medium)' />
                    </div>
                    <IonLabel color='medium'>
                        Add Channel
                    </IonLabel>
                </IonItem>
                <div className='ion-padding-horizontal py-4'>
                    <IonLabel className='text-sm font-medium' color='medium'>Private Messages</IonLabel>
                </div>
            </IonContent>
        </IonPage>
    )
}