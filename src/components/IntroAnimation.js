import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions, Platform, Image } from 'react-native';

const { width, height } = Dimensions.get('window');

const PHOTO_GALLERY = [
    require('../../assets/introgallery/bible1.png'),
    require('../../assets/introgallery/jesus1.png'),
    require('../../assets/introgallery/bible2.png'),
    require('../../assets/introgallery/jesus2.png'),
    require('../../assets/introgallery/bible3.png'),
    require('../../assets/introgallery/jesus3.png'),
    require('../../assets/introgallery/bible4.png'),
    require('../../assets/introgallery/jesus4.png'),
    require('../../assets/introgallery/bible5.png'),
    require('../../assets/introgallery/jesus5.png'),
    require('../../assets/introgallery/jesus6.png'),
];

const IntroAnimation = ({ onComplete }) => {
    // Array of animations for each photo in the collage
    const [revealAnims] = useState(() => 
        PHOTO_GALLERY.map(() => ({
            fade: new Animated.Value(0),
            scale: new Animated.Value(0.8),
        }))
    );

    const collageScale = useRef(new Animated.Value(1)).current;
    const collageOpacity = useRef(new Animated.Value(1)).current;
    const textScale = useRef(new Animated.Value(3)).current;
    const textOpacity = useRef(new Animated.Value(0)).current;
    const containerOpacity = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // 1. Collage Sequential Reveal
        const animations = revealAnims.map((anim, i) => {
            return Animated.sequence([
                Animated.delay(i * 150), // Stagger the appearance
                Animated.parallel([
                    Animated.timing(anim.fade, { toValue: 1, duration: 600, useNativeDriver: true }),
                    Animated.timing(anim.scale, { toValue: 1, duration: 2500, useNativeDriver: true })
                ])
            ]);
        });

        // Run all reveals together but staggered
        Animated.parallel(animations).start();

        // 2. Transition from Collage to Title
        setTimeout(() => {
            Animated.parallel([
                Animated.timing(collageScale, { toValue: 1.5, duration: 1500, useNativeDriver: true }),
                Animated.timing(collageOpacity, { toValue: 0, duration: 1000, useNativeDriver: true }),
            ]).start(() => {
                // Reveal Title
                Animated.parallel([
                    Animated.timing(textScale, { toValue: 1, duration: 1000, useNativeDriver: true }),
                    Animated.timing(textOpacity, { toValue: 1, duration: 800, useNativeDriver: true })
                ]).start();

                // End Intro
                setTimeout(() => {
                    Animated.timing(containerOpacity, { toValue: 0, duration: 800, useNativeDriver: true }).start(() => {
                        if (onComplete) onComplete();
                    });
                }, 2500);
            });
        }, 3200);
    }, []);

    return (
        <Animated.View style={[styles.container, { opacity: containerOpacity }]}>
            {/* Collage Layer */}
            <Animated.View style={[styles.collageContainer, { opacity: collageOpacity, transform: [{ scale: collageScale }] }]}>
                <View style={styles.grid}>
                    {PHOTO_GALLERY.map((img, i) => (
                        <Animated.View 
                            key={i} 
                            style={[
                                styles.gridItem, 
                                { 
                                    opacity: revealAnims[i].fade, 
                                    transform: [{ scale: revealAnims[i].scale }] 
                                }
                            ]}
                        >
                            <Image source={img} style={styles.gridImage} resizeMode="cover" />
                        </Animated.View>
                    ))}
                </View>

                {/* Overlaid Centered Welcome Text */}
                <Animated.View style={[styles.welcomeOverlay, { opacity: revealAnims[Math.min(5, revealAnims.length - 1)].fade }]}>
                    <View style={styles.welcomeBackdrop} />
                    <View style={styles.welcomeContent}>
                        <Text style={styles.welcomeSub}>WELCOME TO THE</Text>
                        <Text style={styles.welcomeMain}>HOLY BIBLE</Text>
                    </View>
                </Animated.View>

                <View style={styles.vignette} />
            </Animated.View>

            {/* Title Layer */}
            <Animated.View style={[styles.textContainer, { opacity: textOpacity, transform: [{ scale: textScale }] }]}>
                <Text style={styles.titleSub}>ENTERING</Text>
                <Text style={styles.title}>HOLY BIBLE</Text>
                <Text style={styles.titleTelugu}>పరిశుద్ధ గ్రంథం</Text>
            </Animated.View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
    },
    collageContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    welcomeOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    welcomeBackdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    welcomeContent: {
        alignItems: 'center',
        paddingHorizontal: 40,
        paddingVertical: 20,
    },
    welcomeSub: {
        fontSize: 14,
        color: '#FFF',
        fontWeight: '300',
        letterSpacing: 10,
        opacity: 0.9,
    },
    welcomeMain: {
        fontSize: 32,
        color: '#D4AF37',
        fontWeight: '900',
        letterSpacing: 6,
        marginTop: 10,
        textAlign: 'center',
        textShadowColor: 'rgba(212, 175, 55, 0.4)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 20,
    },
    grid: {
        width: width,
        height: height,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 4,
    },
    gridItem: {
        width: (width - 24) / 3,
        height: (height - 24) / 4,
        margin: 2,
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(212, 175, 55, 0.15)',
    },
    gridImage: {
        width: '100%',
        height: '100%',
    },
    vignette: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    textContainer: {
        alignItems: 'center',
        position: 'absolute',
    },
    titleSub: {
        fontSize: 14,
        color: '#D4AF37',
        fontWeight: '900',
        letterSpacing: 8,
        marginBottom: 8,
    },
    title: {
        fontSize: 56,
        fontWeight: '900',
        color: '#FFF',
        letterSpacing: 4,
        textShadowColor: 'rgba(212, 175, 55, 0.5)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 30,
    },
    titleTelugu: {
        fontSize: 28,
        color: '#D4AF37',
        marginTop: 10,
        fontWeight: '900',
    }
});

export default IntroAnimation;
