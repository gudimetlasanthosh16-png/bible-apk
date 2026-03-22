import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions, Platform, Image } from 'react-native';

const { width, height } = Dimensions.get('window');
const RAY_COUNT = 80;

const PHOTO_GALLERY = [
    require('../../assets/intro_gallery/bible_1.png'),
    require('../../assets/intro_gallery/jesus_1.png'),
    require('../../assets/intro_gallery/bible_2.png'),
    require('../../assets/intro_gallery/jesus_2.png'),
    require('../../assets/intro_gallery/bible_3.png'),
    require('../../assets/intro_gallery/jesus_3.png'),
    require('../../assets/intro_gallery/bible_4.png'),
    require('../../assets/intro_gallery/jesus_4.png'),
    require('../../assets/intro_gallery/bible_5.png'),
    require('../../assets/intro_gallery/jesus_5.png'),
    require('../../assets/intro_gallery/jesus_6.png'),
];

const IntroAnimation = ({ onComplete }) => {
    // Array of animations for each photo in the collage
    const [revealAnims] = useState(() => 
        PHOTO_GALLERY.map(() => ({
            fade: new Animated.Value(0),
            scale: new Animated.Value(0.8),
        }))
    );

    const [showTunnel, setShowTunnel] = useState(false);
    const [rays] = useState(() =>
        Array.from({ length: RAY_COUNT }).map(() => ({
            progress: new Animated.Value(0),
            angle: Math.random() * 360,
            distance: Math.random() * 100 + 10,
            duration: 800 + Math.random() * 1200,
            delay: Math.random() * 1500,
            color: ['#E50914', '#ffffff', '#D4AF37', '#9C27B0'][Math.floor(Math.random() * 4)],
            thickness: Math.random() * 2 + 1,
        }))
    );

    const collageScale = useRef(new Animated.Value(1)).current;
    const collageOpacity = useRef(new Animated.Value(1)).current;
    const tunnelScale = useRef(new Animated.Value(1)).current;
    const tunnelOpacity = useRef(new Animated.Value(0)).current;
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

        // 2. Transition from Collage to Tunnel
        setTimeout(() => {
            Animated.parallel([
                Animated.timing(collageScale, { toValue: 1.5, duration: 1500, useNativeDriver: true }),
                Animated.timing(collageOpacity, { toValue: 0, duration: 1000, useNativeDriver: true }),
                Animated.timing(tunnelOpacity, { toValue: 1, duration: 1000, useNativeDriver: true }),
            ]).start(() => {
                setShowTunnel(true);
                startTunnelAnimation();
            });
        }, 3200);

        const startTunnelAnimation = () => {
            // Start Tunnel Streaks
            rays.forEach((ray) => {
                setTimeout(() => {
                    Animated.loop(
                        Animated.timing(ray.progress, {
                            toValue: 1,
                            duration: ray.duration,
                            useNativeDriver: true,
                        })
                    ).start();
                }, ray.delay);
            });

            // Zoom inside the tunnel
            setTimeout(() => {
                Animated.timing(tunnelScale, { toValue: 8, duration: 1200, useNativeDriver: true }).start();
                Animated.timing(tunnelOpacity, { toValue: 0, duration: 800, useNativeDriver: true }).start();
            }, 1000);

            // Reveal Title
            Animated.sequence([
                Animated.delay(1800),
                Animated.parallel([
                    Animated.timing(textScale, { toValue: 1, duration: 1000, useNativeDriver: true }),
                    Animated.timing(textOpacity, { toValue: 1, duration: 800, useNativeDriver: true })
                ])
            ]).start();

            // End Intro
            setTimeout(() => {
                Animated.timing(containerOpacity, { toValue: 0, duration: 800, useNativeDriver: true }).start(() => {
                    if (onComplete) onComplete();
                });
            }, 4500);
        };
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

            {/* Tunnel Layer */}
            {showTunnel && (
                <Animated.View style={[styles.tunnelContainer, { opacity: tunnelOpacity, transform: [{ scale: tunnelScale }] }]}>
                    {rays.map((ray, i) => {
                        const translateY = ray.progress.interpolate({ inputRange: [0, 1], outputRange: [ray.distance, height] });
                        const scaleY = ray.progress.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.1, 50, 100] });
                        const opacity = ray.progress.interpolate({ inputRange: [0, 0.2, 0.8, 1], outputRange: [0, 1, 1, 0] });

                        return (
                            <Animated.View
                                key={i}
                                style={[styles.ray, {
                                        backgroundColor: ray.color,
                                        width: ray.thickness,
                                        opacity,
                                        transform: [
                                            { rotate: ray.angle + 'deg' },
                                            { translateY },
                                            { scaleY }
                                        ]
                                    }
                                ]}
                            />
                        );
                    })}
                </Animated.View>
            )}

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
    tunnelContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ray: {
        position: 'absolute',
        height: 10,
        borderRadius: 5,
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
