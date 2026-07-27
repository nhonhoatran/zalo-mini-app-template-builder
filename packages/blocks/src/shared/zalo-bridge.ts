/**
 * Zalo Bridge Service
 * Abstraction layer over zmp-sdk for components.
 * Enables running seamlessly inside Web Preview (Mock) and Real Zalo App (Real SDK).
 */

export interface ZaloUserInfo {
  id: string;
  name: string;
  avatar: string;
}

export interface ZaloLocation {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface IZaloBridge {
  openPhone(phoneNumber: string): Promise<void>;
  getUserInfo(): Promise<ZaloUserInfo>;
  getLocation(): Promise<ZaloLocation>;
}

export class MockZaloBridge implements IZaloBridge {
  async openPhone(phoneNumber: string): Promise<void> {
    console.log(`[MockZaloBridge] Gọi điện thoại tới SĐT: ${phoneNumber}`);
    alert(`[Mock Zalo App] Đang mở cuộc gọi tới: ${phoneNumber}`);
  }

  async getUserInfo(): Promise<ZaloUserInfo> {
    console.log("[MockZaloBridge] Lấy thông tin user...");
    return {
      id: "mock_user_123",
      name: "Nguyễn Văn A (Demo)",
      avatar: "https://via.placeholder.com/150?text=UserAvatar",
    };
  }

  async getLocation(): Promise<ZaloLocation> {
    console.log("[MockZaloBridge] Lấy vị trí GPS...");
    return {
      latitude: 10.7769,
      longitude: 106.7009,
      address: "Bến Thành, Quận 1, TP. Hồ Chí Minh",
    };
  }
}

export class RealZaloBridge implements IZaloBridge {
  async openPhone(phoneNumber: string): Promise<void> {
    try {
      // Dynamic import or zmp-sdk runtime call
      const api = (window as unknown as { zmp?: { openPhone?: (opts: { phoneNumber: string }) => Promise<void> } }).zmp;
      if (api?.openPhone) {
        await api.openPhone({ phoneNumber });
      } else {
        window.location.href = `tel:${phoneNumber}`;
      }
    } catch (err) {
      console.error("[RealZaloBridge] openPhone error:", err);
    }
  }

  async getUserInfo(): Promise<ZaloUserInfo> {
    try {
      const api = (window as unknown as { zmp?: { getUserInfo?: () => Promise<{ userInfo: ZaloUserInfo }> } }).zmp;
      if (api?.getUserInfo) {
        const res = await api.getUserInfo();
        return res.userInfo;
      }
    } catch (err) {
      console.error("[RealZaloBridge] getUserInfo error:", err);
    }
    return { id: "unknown", name: "Khách hàng Zalo", avatar: "" };
  }

  async getLocation(): Promise<ZaloLocation> {
    try {
      const api = (window as unknown as { zmp?: { getLocation?: () => Promise<{ latitude: number; longitude: number }> } }).zmp;
      if (api?.getLocation) {
        const res = await api.getLocation();
        return { latitude: res.latitude, longitude: res.longitude };
      }
    } catch (err) {
      console.error("[RealZaloBridge] getLocation error:", err);
    }
    return { latitude: 10.7769, longitude: 106.7009 };
  }
}

const isZaloEnvironment = typeof window !== "undefined" && Boolean((window as unknown as { zmp?: unknown }).zmp);

export const zaloBridge: IZaloBridge = isZaloEnvironment
  ? new RealZaloBridge()
  : new MockZaloBridge();
