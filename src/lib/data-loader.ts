// lib/data-loader.ts
// This module is the sole gateway for loading foundational data.
// It ensures a clean separation between data fetching and our UI components.

import fs from "fs/promises"
import path from "path"
import { RailwayNetwork, Train } from "./types"

// A robust way to locate our data files.
const dataDirectory = path.join(process.cwd(), "src", "lib", "data")

/**
 * Loads and parses the railway network data.
 * @returns A promise that resolves to the RailwayNetwork object.
 */
export async function loadNetworkData(): Promise<RailwayNetwork> {
  const filePath = path.join(dataDirectory, "network.json")
  try {
    const fileContents = await fs.readFile(filePath, "utf8")
    const data = JSON.parse(fileContents) as RailwayNetwork
    return data
  } catch (error) {
    console.error("Failed to load network data:", error)
    // In a real application, you might want more robust error handling.
    // For now, we throw to make the failure obvious during development.
    throw new Error("Could not load or parse network.json.")
  }
}

/**
 * Loads and parses the train data.
 * @returns A promise that resolves to an array of Train objects.
 */
export async function loadTrainData(): Promise<Train[]> {
  const filePath = path.join(dataDirectory, "trains.json")
  try {
    const fileContents = await fs.readFile(filePath, "utf8")
    // The trains are nested under a "trains" key in the JSON file.
    const data = JSON.parse(fileContents) as { trains: Train[] }
    return data.trains
  } catch (error) {
    console.error("Failed to load train data:", error)
    throw new Error("Could not load or parse trains.json.")
  }
}
