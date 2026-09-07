import { SavedGameProfile, Hero, SpiritCompanion } from '../types';
import { INITIAL_HEROES } from '../data/characters';
import { INITIAL_SPIRITS, applyAwakenRankToSpirit } from '../data/spirits';

const STORAGE_KEY_PROFILES = 'bhawana_phantom_profiles_v1';
const STORAGE_KEY_ACTIVE_ID = 'bhawana_phantom_active_profile_id';

class SaveService {
  // Get all saved profiles from LocalStorage
  public getAllProfiles(): SavedGameProfile[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_PROFILES);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.sort((a, b) => b.lastSavedAt - a.lastSavedAt);
      }
      return [];
    } catch (e) {
      console.error('Failed to parse saved profiles', e);
      return [];
    }
  }

  // Get specific profile
  public getProfileById(id: string): SavedGameProfile | null {
    const all = this.getAllProfiles();
    return all.find(p => p.id === id) || null;
  }

  // Save or update a profile
  public saveProfile(profile: SavedGameProfile): void {
    try {
      const all = this.getAllProfiles();
      const updatedProfile = {
        ...profile,
        lastSavedAt: Date.now()
      };
      const idx = all.findIndex(p => p.id === profile.id);
      if (idx !== -1) {
        all[idx] = updatedProfile;
      } else {
        all.push(updatedProfile);
      }
      localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(all));
      this.setActiveProfileId(profile.id);
    } catch (e) {
      console.error('Failed to save profile to LocalStorage', e);
    }
  }

  // Delete a profile
  public deleteProfile(id: string): void {
    try {
      const all = this.getAllProfiles().filter(p => p.id !== id);
      localStorage.setItem(STORAGE_KEY_PROFILES, JSON.stringify(all));
      if (this.getActiveProfileId() === id) {
        this.setActiveProfileId(null);
      }
    } catch (e) {
      console.error('Failed to delete profile', e);
    }
  }

  // Active Profile Tracking
  public getActiveProfileId(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEY_ACTIVE_ID);
    } catch {
      return null;
    }
  }

  public setActiveProfileId(id: string | null): void {
    try {
      if (id) {
        localStorage.setItem(STORAGE_KEY_ACTIVE_ID, id);
      } else {
        localStorage.removeItem(STORAGE_KEY_ACTIVE_ID);
      }
    } catch {
      // ignore
    }
  }

  // Create a brand new initial profile
  public createNewProfile(
    playerName: string,
    leadHeroId: string,
    starterSpiritElement: 'Agni' | 'Tirta' | 'Vidyut'
  ): SavedGameProfile {
    const profiles = this.getAllProfiles();
    const nextSlot = profiles.length + 1;
    const profileId = `profile_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // Prepare starter spirits
    let starterSpiritId = 'garuda_hayam';
    if (starterSpiritElement === 'Tirta') starterSpiritId = 'nyai_candra_kirana';
    if (starterSpiritElement === 'Vidyut') starterSpiritId = 'bharata_petir';

    const starterSpirit = INITIAL_SPIRITS.find(s => s.id === starterSpiritId) || INITIAL_SPIRITS[0];
    const secondarySpirit = INITIAL_SPIRITS.find(s => s.id === 'kuntilanak_merah') || INITIAL_SPIRITS[1];

    const ownedSpirits: SpiritCompanion[] = [
      applyAwakenRankToSpirit(starterSpirit, 1),
      applyAwakenRankToSpirit(secondarySpirit, 1)
    ];

    // Prepare heroes with custom lead
    const heroes: Hero[] = INITIAL_HEROES.map(h => {
      const isLead = h.id === leadHeroId;
      return {
        ...h,
        name: isLead && playerName.trim() ? playerName.trim() : h.name,
        equippedSpiritId: isLead ? starterSpirit.id : h.equippedSpiritId,
        spirits: isLead ? [starterSpirit] : h.spirits
      };
    });

    const newProfile: SavedGameProfile = {
      id: profileId,
      slotNumber: nextSlot,
      playerName: playerName.trim() || 'Penyelidik Roh',
      leadHeroId: leadHeroId,
      playerLevel: 1,
      playerExp: 0,
      spiritGems: 150, // Starting bonus
      unlockedChapterId: 'chap_0',
      unlockedClues: ['clue_partitur'],
      heroes: heroes,
      ownedSpirits: ownedSpirits,
      createdAt: Date.now(),
      lastSavedAt: Date.now()
    };

    this.saveProfile(newProfile);
    return newProfile;
  }
}

export const saveService = new SaveService();
