// PomodoroApp/app/(tabs)/index.tsx
import { Image, StyleSheet, Platform} from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import CircularPomodoroTimer from '@/components/CircularPomodoroTimer';
import { useGlobalContext } from '@/context/AppContext';
import { useEffect } from 'react';
import { useObject, useRealm } from '@realm/react';
import { User } from '@/db/models/User';
import { Realm } from '@realm/react';

export default function HomeScreen() {

  const newUser = useObject(User, new Realm.BSON.ObjectID("672d338c26e765ae29cfad16"))
  const {user,setUser,setRealm,realm} = useGlobalContext();
  const myRealm = useRealm();

  useEffect(() => {
    if(!user){      
      setUser(newUser)
    }

    if(!realm){
      setRealm(myRealm)
    }
  },[user,realm])
  
  return (
    <>
      <CircularPomodoroTimer />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  text: {
    fontSize: 20,
    color: '#333',
    marginBottom: 20,
  },
  link: {
    color: '#1B95E0',
  },
  code: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  wave: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },

});