import React from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { AvailableSections } from "@/components/AvailableSections";
import { AboutAndEvents } from "@/components/AboutAndEvents";
import { Gallery } from "@/components/Gallery";
import { Footer } from "@/components/Footer";
import { IndiaInternshipMap } from "@/components/IndiaInternshipMap";

const Index: React.FC = () => {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <AvailableSections />
        <AboutAndEvents />
        <Gallery />
        {/* INDIA MAP SECTION AFTER GALLERY */}
        <IndiaInternshipMap />
      </main>
      <Footer />
    </>
  );
};

export default Index;
