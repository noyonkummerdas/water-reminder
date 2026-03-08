import React, { useEffect } from 'react';
import { View } from 'react-native';
import Svg, {
    Path,
    Defs,
    Mask,
    G,
    Rect,
    LinearGradient,
    Stop,
    Text as SvgText,
    RadialGradient
} from 'react-native-svg';
import Animated, {
    useSharedValue,
    useAnimatedProps,
    withTiming,
    interpolate,
    withRepeat,
    Easing,
} from 'react-native-reanimated';

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface WaterJarProps {
    percentage: number;
    ml: number;
}

export default function WaterJar({ percentage, ml }: WaterJarProps) {
    const fillLevel = useSharedValue(0);
    const waveOffset = useSharedValue(0);

    useEffect(() => {
        const safePercent = isNaN(percentage) ? 0 : percentage;
        fillLevel.value = withTiming(safePercent, {
            duration: 2000,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1)
        });

        waveOffset.value = withRepeat(
            withTiming(1, { duration: 4000, easing: Easing.linear }),
            -1,
            false
        );
    }, [percentage]);

    const animatedWaveProps = useAnimatedProps(() => {
        const yValue = interpolate(fillLevel.value, [0, 100], [92, 8]);
        const xOffset = waveOffset.value * 50;

        const wave = `M -20 ${yValue} 
                     Q ${-10 + xOffset} ${yValue - 3}, ${10 + xOffset} ${yValue} 
                     T ${40 + xOffset} ${yValue} 
                     T ${70 + xOffset} ${yValue} 
                     T ${100 + xOffset} ${yValue} 
                     L 100 100 L -20 100 Z`;

        return { d: wave };
    });

    const jarPath = "M32,4 L68,4 C76,4 82,10 82,18 L82,85 C82,93 75,99 67,99 L33,99 C25,99 18,93 18,85 L18,18 C18,10 24,4 32,4 Z";

    return (
        <View className="items-center justify-center p-4">
            <Svg width="220" height="280" viewBox="0 0 100 100">
                <Defs>
                    <LinearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <Stop offset="0%" stopColor="#22D3EE" />
                        <Stop offset="100%" stopColor="#0891B2" />
                    </LinearGradient>

                    <RadialGradient id="glassGloss" cx="30%" cy="30%" rx="30%" ry="30%" fx="30%" fy="30%">
                        <Stop offset="0%" stopColor="white" stopOpacity="0.4" />
                        <Stop offset="100%" stopColor="white" stopOpacity="0" />
                    </RadialGradient>

                    <Mask id="jarMask">
                        <Path d={jarPath} fill="white" />
                    </Mask>
                </Defs>

                {/* Sub-Layer: Shadow Depth */}
                <Path
                    d={jarPath}
                    fill="rgba(0,0,0,0.03)"
                    transform="translate(2, 2)"
                />

                {/* Main Jar Case (Glass) */}
                <Path
                    d={jarPath}
                    fill="#F1F5F9"
                    stroke="rgba(0, 189, 214, 0.4)"
                    strokeWidth="1.5"
                />

                {/* Water Content Layer */}
                <G mask="url(#jarMask)">
                    {/* Base Color */}
                    <AnimatedPath
                        fill="url(#waterGradient)"
                        animatedProps={useAnimatedProps(() => {
                            const y = interpolate(fillLevel.value, [0, 100], [92, 8]);
                            return { d: `M 0 ${y} L 100 ${y} L 100 100 L 0 100 Z` };
                        })}
                    />
                    {/* Animated Waves */}
                    <AnimatedPath
                        fill="url(#waterGradient)"
                        animatedProps={animatedWaveProps}
                    />
                </G>

                {/* Glass Inner Shine (Left Side) */}
                <Path
                    d="M24,18 L24,85"
                    stroke="rgba(255,255,255,0.7)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeDasharray="4,8"
                />

                {/* Glossy Reflection (Radial) */}
                <Rect x="20" y="8" width="60" height="80" fill="url(#glassGloss)" mask="url(#jarMask)" />

                {/* Jar Outer Glow (Border) */}
                <Path
                    d={jarPath}
                    fill="none"
                    stroke="#00BDD6"
                    strokeWidth="3.5"
                    strokeOpacity="0.15"
                />

                {/* ML Indicator Label */}
                <SvgText
                    x="50"
                    y="53"
                    fill={fillLevel.value > 50 ? "white" : "#0F172A"}
                    fontSize="13"
                    fontWeight="900"
                    textAnchor="middle"
                    letterSpacing="0.5"
                >
                    {ml || 0}
                </SvgText>
                <SvgText
                    x="50"
                    y="63"
                    fill={fillLevel.value > 60 ? "rgba(255,255,255,0.7)" : "#64748B"}
                    fontSize="6"
                    fontWeight="800"
                    textAnchor="middle"
                    opacity="0.8"
                >
                    ML DRUNK
                </SvgText>

                {/* Elegant Cap / Lid */}
                <Rect x="34" y="-1" width="32" height="7" rx="3.5" fill="#334155" />
                <Rect x="34" y="2" width="32" height="1.5" fill="#475569" />

                {/* Visual Measurement Lines */}
                {[20, 40, 60, 80].map((level) => (
                    <G key={level}>
                        <Rect x="75" y={90 - (level * 0.8)} width="6" height="1" fill="#94A3B8" opacity="0.3" />
                        <SvgText
                            x="71"
                            y={91 - (level * 0.8)}
                            fill="#94A3B8"
                            fontSize="3"
                            fontWeight="800"
                            textAnchor="end"
                            opacity="0.6"
                        >
                            {level}%
                        </SvgText>
                    </G>
                ))}
            </Svg>
        </View>
    );
}
