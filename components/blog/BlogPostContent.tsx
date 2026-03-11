"use client";

import { motion } from "framer-motion";

export default function BlogPostContent({ html }: { html: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="blog-prose"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
