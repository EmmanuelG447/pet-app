import React, { useCallback, useState } from 'react';
import {
  Text,
  View,
  Image,
  Pressable,
  Alert,
  Modal,
  Dimensions,
  StyleSheet,
} from 'react-native';
import Colors from './../../constants/Colors';
import * as WebBrowser from 'expo-web-browser';
import { Link } from 'expo-router';
import { useOAuth } from '@clerk/clerk-expo';
import * as Linking from 'expo-linking';

const { width, height } = Dimensions.get('window'); // Dimensiones de la pantalla

export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  useWarmUpBrowser();

  const { startOAuthFlow: startGoogleOAuthFlow } = useOAuth({ strategy: 'oauth_google' });
  const { startOAuthFlow: startFacebookOAuthFlow } = useOAuth({ strategy: 'oauth_facebook' });

  const [modalVisible, setModalVisible] = useState(false);

  const handleLoginOption = useCallback(
    async (provider) => {
      setModalVisible(false);
      try {
        const { createdSessionId } = await (provider === 'google'
          ? startGoogleOAuthFlow({
              redirectUrl: Linking.createURL('/(tabs)/home', { scheme: 'myapp' }),
            })
          : startFacebookOAuthFlow({
              redirectUrl: Linking.createURL('/(tabs)/home', { scheme: 'myapp' }),
            }));

        if (createdSessionId) {
          // Session created successfully
        } else {
          // Handle signIn or signUp for next steps such as MFA
        }
      } catch (err) {
        console.error(`${provider} OAuth error`, err);
      }
    },
    [startGoogleOAuthFlow, startFacebookOAuthFlow]
  );

  return (
    <View style={styles.container}>
      <Image source={require('./../../assets/images/login.png')} style={styles.image} />

      <View style={styles.textContainer}>
        <Text style={styles.title}>Ready to make a new friend?</Text>
        <Text style={styles.subtitle}>
          Let's adopt the pet you love and give them a happy life again.
        </Text>
      </View>

      <Pressable onPress={() => setModalVisible(true)} style={styles.button}>
        <Text style={styles.buttonText}>Get Started</Text>
      </Pressable>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose login method</Text>

            <Pressable onPress={() => handleLoginOption('google')} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Continue with Google</Text>
            </Pressable>

            <Pressable onPress={() => handleLoginOption('facebook')} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Continue with Facebook</Text>
            </Pressable>

            <Pressable onPress={() => setModalVisible(false)} style={styles.modalCancelButton}>
              <Text style={styles.modalCancelButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.WHITE,
    flex: 1,
  },
  image: {
    width: '100%',
    height: height * 0.4, // 40% del alto de la pantalla
    resizeMode: 'cover',
  },
  textContainer: {
    padding: width * 0.05, // 5% del ancho como padding
    alignItems: 'center',
  },
  title: {
    fontFamily: 'outfit-bold',
    fontSize: width * 0.07, // Escala según el ancho de pantalla
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'outfit',
    fontSize: width * 0.045, // Escala para subtítulos
    textAlign: 'center',
    color: Colors.GRAY,
    marginTop: 10,
  },
  button: {
    padding: 14,
    marginTop: height * 0.05, // 5% del alto como margen superior
    backgroundColor: Colors.PRIMARY,
    width: width * 0.9, // 90% del ancho de la pantalla
    alignSelf: 'center',
    borderRadius: 14,
  },
  buttonText: {
    fontFamily: 'outfit-medium',
    fontSize: width * 0.05,
    textAlign: 'center',
    color: Colors.WHITE,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: width * 0.8, // 80% del ancho de la pantalla
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontFamily: 'outfit-bold',
    fontSize: width * 0.06,
    marginBottom: 20,
  },
  modalButton: {
    padding: 14,
    backgroundColor: Colors.PRIMARY,
    width: '100%',
    borderRadius: 14,
    marginBottom: 10,
  },
  modalButtonText: {
    fontFamily: 'outfit-medium',
    fontSize: width * 0.045,
    textAlign: 'center',
    color: Colors.WHITE,
  },
  modalCancelButton: {
    padding: 14,
    marginTop: 20,
    backgroundColor: Colors.GRAY,
    width: '100%',
    borderRadius: 14,
  },
  modalCancelButtonText: {
    fontFamily: 'outfit-medium',
    fontSize: width * 0.045,
    textAlign: 'center',
    color: 'white',
  },
});
