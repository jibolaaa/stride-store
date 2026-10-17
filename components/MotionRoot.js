"use client";
// Motion settings for the whole site: respect "reduce motion" on the device.
import { MotionConfig } from "motion/react";

export default function MotionRoot({ children }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
