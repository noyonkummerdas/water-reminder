import React, { useEffect, useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Path, Defs, Mask, G } from 'react-native-svg';
import Animated, {
    useSharedValue,
    useAnimatedProps,
    withTiming,
    interpolate,
    withRepeat,
    useAnimatedStyle,
} from 'react-native-reanimated';

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface BodyVisualizerProps {
    gender: 'male' | 'female';
    percentage: number;
    height?: number;
    weight?: number;
}

/**
 * PROFESSIONAL HUMAN SILHOUETTTS (Anatomically Proportional)
 * These paths represent a standard, healthy "normal" human body.
 * Viewbox: 0 0 100 240
 */
const MALE_SILHOUETTE =
    // Head & Neck
    "M50,2 C54.5,2 58,5.5 58,10.5 C58,15.5 54.5,19 50,19 C45.5,19 42,15.5 42,10.5 C42,5.5 45.5,2 50,2 Z " +
    "M48,19 L52,19 L52,24 L48,24 Z " +
    // Torso, Arms & Legs
    "M36,24 C28,24 25,27 22,35 L17,85 C17,92 20,95 24,95 L26,95 L29,45 L34,45 L34,115 L30,122 L30,230 " +
    "C30,237 36,240 40,240 C44,240 47,235 47,225 L47,140 L53,140 L53,225 " +
    "C53,235 56,240 60,240 C64,240 70,237 70,230 L70,122 L66,115 L66,45 L71,45 L74,95 L76,95 " +
    "C80,95 83,92 83,85 L78,35 C75,27 72,24 64,24 L36,24 Z";

const FEMALE_SILHOUETTE =
    // Head & Neck
    "M50,2 C54.5,2 58.1,5.6 58.1,10.1 C58.1,14.6 54.5,18.2 50,18.2 C45.5,18.2 41.9,14.6 41.9,10.1 C41.9,5.6 45.5,2 50,2 Z " +
    "M48,18 L52,18 L52,24 C52,24 62,24 68,32 L75,85 C75,90 77,93 83,93 C89,93 91,90 90,85 L85,32 " +
    "C80,24 75,22 65,22 L35,22 C25,22 20,24 15,32 L10,85 C9,90 11,93 17,93 C23,93 25,90 25,85 L32,32 " +
    "C38,24 48,24 48,24 L48,18 Z " + // This was just arms/chest
    // Added Torso/Legs to Female
    "M40,24 C34,24 30,26 28,34 L27,85 C25,105 22,115 30,130 L28,230 C28,237 34,240 39,240 C44,240 47,235 47,225 L47,145 L53,145 L53,225 " +
    "C53,235 56,240 61,240 C66,240 72,237 72,230 L70,130 C78,115 75,105 73,85 L72,34 C68,28 65,24 60,24 L40,24 Z";

export default function BodyVisualizer({ gender, percentage, height = 170, weight = 70 }: BodyVisualizerProps) {
    const fillLevel = useSharedValue(0);
    const waveOffset = useSharedValue(0);

    // Height/Weight Scaling
    const heightScale = useMemo(() => interpolate(height, [140, 210], [0.85, 1.15]), [height]);
    const weightScale = useMemo(() => interpolate(weight, [40, 120], [0.85, 1.3]), [weight]);

    useEffect(() => {
        const safePercent = isNaN(percentage) ? 0 : percentage;
        fillLevel.value = withTiming(safePercent, { duration: 1500 });

        waveOffset.value = withRepeat(
            withTiming(1, { duration: 3000 }),
            -1,
            false
        );
    }, [percentage]);

    const animatedWaveProps = useAnimatedProps(() => {
        const yValue = interpolate(fillLevel.value, [0, 100], [235, 5]);
        const xOffset = waveOffset.value * 120;

        const wave = `M -60 ${yValue}
                     Q ${-30 + xOffset} ${yValue - 7}, ${0 + xOffset} ${yValue}
                     T ${60 + xOffset} ${yValue}
                     T ${120 + xOffset} ${yValue}
                     T ${180 + xOffset} ${yValue}
                     L 180 250 L -60 250 Z`;

        return { d: wave };
    });

    const bodyPath = gender === 'male' ? MALE_SILHOUETTE : FEMALE_SILHOUETTE;

    const animatedBodyStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { scaleX: withTiming(weightScale, { duration: 800 }) },
                { scaleY: withTiming(heightScale, { duration: 800 }) }
            ],
        };
    });

    return (
        <View className="items-center justify-center py-2" style={{ height: 260 }}>
            <Animated.View style={animatedBodyStyle}>
                <Svg width="140" height="240" viewBox="0 0 100 245">
                    <Defs>
                        <Mask id="bodyMask">
                            <Path d={bodyPath} fill="white" />
                        </Mask>
                    </Defs>

                    {/* RED EMPTY BODY */}
                    <Path
                        d={bodyPath}
                        fill="#FF5E5E"
                    />

                    {/* BLUE WATER FILL */}
                    <G mask="url(#bodyMask)">
                        <AnimatedPath
                            fill="#00BDD6"
                            animatedProps={useAnimatedProps(() => {
                                const y = interpolate(fillLevel.value, [0, 100], [240, 5]);
                                return {
                                    d: `M 0 ${y} L 100 ${y} L 100 250 L 0 250 Z`
                                };
                            })}
                        />
                        <AnimatedPath
                            fill="#00BDD6"
                            animatedProps={animatedWaveProps}
                        />
                    </G>
                </Svg>
            </Animated.View>
        </View>
    );
}
