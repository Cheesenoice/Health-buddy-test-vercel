ok bây giờ thiết kế giao diện zalo mini app có tab bar bên dưới có các nút quan trọng như trang chủ và quét, bạn sáng tạo và thiết kế đúng theo chuẩn tôi muốn

cần những giao diện cần thiết như tôi đã yêu cầu, trang chủ và lịch sử và quét đơn giấy, vài thứ hay ho nữa nếu bạn sáng tạo như chatbot, đặt lịch khám và tái khám

- giao diện app

    <!DOCTYPE html>
    <html lang="vi">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>HealFlow - Tâm An AI</title>
    <style>
    /* --- 1. DESIGN SYSTEM (Zalo Style) --- */
    :root {
    --primary: #0068FF; /* Zalo Blue */
    --primary-light: #E1F0FF;
    --bg-body: #F5F6F8;
    --bg-card: #FFFFFF;
    --text-main: #2E333D;
    --text-sub: #767A82;
    --danger: #FF3B30;
    --warning: #FF9500;
    --success: #34C759;
    --shadow: 0 4px 12px rgba(0,0,0,0.04);
    --tab-height: 60px;
    }
    
    ```
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; outline: none; }
        body {
            margin: 0; padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: var(--bg-body); color: var(--text-main);
            height: 100vh; overflow: hidden; /* App-like feel */
        }
    
        /* --- 2. LAYOUT STRUCTURE --- */
        #app-container {
            display: flex; flex-direction: column; height: 100%;
            max-width: 450px; margin: 0 auto; background: var(--bg-body); position: relative;
        }
    
        /* HEADER */
        .z-header {
            height: 50px; background: white; display: flex; align-items: center; justify-content: center;
            font-weight: 700; font-size: 17px; border-bottom: 1px solid #E0E2E7;
            position: relative; flex-shrink: 0; z-index: 10;
        }
        .header-avatar { position: absolute; left: 15px; font-size: 24px; }
        .header-sos { position: absolute; right: 15px; color: var(--danger); font-weight: 800; font-size: 14px; border: 1px solid var(--danger); padding: 4px 8px; border-radius: 6px; }
    
        /* MAIN CONTENT AREA */
        .page-content {
            flex: 1; overflow-y: auto; padding: 16px; padding-bottom: 80px; /* Space for TabBar */
            display: none; /* Hide pages by default */
            animation: fadeIn 0.3s;
        }
        .page-content.active { display: block; }
    
        /* BOTTOM TAB BAR */
        .tab-bar {
            height: var(--tab-height); background: white; border-top: 1px solid #E0E2E7;
            display: flex; align-items: center; justify-content: space-around;
            position: absolute; bottom: 0; width: 100%; z-index: 100;
            padding-bottom: env(safe-area-inset-bottom);
        }
        .tab-item {
            display: flex; flex-direction: column; align-items: center; justify-content: center;
            flex: 1; color: #9aa0a6; font-size: 10px; font-weight: 600; cursor: pointer;
        }
        .tab-item.active { color: var(--primary); }
        .tab-icon { font-size: 24px; margin-bottom: 2px; }
    
        /* SCAN BUTTON (Central Floating) */
        .scan-btn-wrapper {
            position: relative; top: -20px;
            width: 60px; height: 60px;
            background: var(--primary); border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            box-shadow: 0 4px 10px rgba(0, 104, 255, 0.3);
            border: 4px solid var(--bg-body);
        }
        .scan-icon { font-size: 28px; color: white; }
    
        /* --- 3. COMPONENT STYLES --- */
    
        /* Sections */
        .section-title { font-size: 16px; font-weight: 700; margin: 20px 0 12px; display: flex; justify-content: space-between; align-items: center; }
        .link-text { font-size: 13px; color: var(--primary); font-weight: 500; }
    
        /* Cards */
        .card { background: var(--bg-card); border-radius: 16px; padding: 16px; margin-bottom: 12px; box-shadow: var(--shadow); }
    
        /* AI Diagnosis Card */
        .diag-card { background: #FFF8E1; border: 1px solid #FFE082; padding: 16px; border-radius: 12px; }
        .diag-title { color: #B94A00; font-weight: 700; display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
    
        /* Horizontal Timetable */
        .h-scroll { display: flex; overflow-x: auto; gap: 12px; padding-bottom: 10px; scrollbar-width: none; }
        .time-card {
            flex: 0 0 85%; background: white; border-radius: 16px; padding: 16px;
            border: 1px solid #E0E2E7; transition: 0.2s;
        }
        .time-card.active {
            border: 2px solid var(--primary); background: #F0F7FF;
            transform: scale(1.02); box-shadow: 0 8px 15px rgba(0, 104, 255, 0.15);
        }
        .tc-head { display: flex; justify-content: space-between; margin-bottom: 12px; }
        .tc-time { font-size: 18px; font-weight: 800; color: var(--primary); }
        .tc-tag { font-size: 11px; font-weight: 700; padding: 4px 8px; border-radius: 6px; }
        .tag-active { background: var(--primary); color: white; }
    
        /* Drug Item within Card */
        .drug-row { display: flex; align-items: center; gap: 12px; margin-top: 10px; padding-top: 10px; border-top: 1px dashed #E0E2E7; }
        .drug-img { width: 44px; height: 44px; background: white; border: 1px solid #eee; border-radius: 8px; object-fit: contain; }
        .info-btn { width: 22px; height: 22px; background: #E1F0FF; color: var(--primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold; margin-left: 5px; }
    
        /* Predictive Grid */
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .big-btn {
            background: white; padding: 16px; border-radius: 16px; text-align: center;
            box-shadow: var(--shadow); border: 1px solid transparent;
        }
        .big-btn:active { background: #F5F6F8; transform: scale(0.98); }
        .bb-icon { font-size: 32px; margin-bottom: 8px; display: block; }
        .bb-text { font-size: 14px; font-weight: 600; line-height: 1.3; }
    
        /* History Timeline (Vertical) */
        .v-timeline { padding-left: 20px; border-left: 2px solid #E0E2E7; margin-left: 10px; }
        .vt-item { position: relative; padding-left: 20px; margin-bottom: 25px; }
        .vt-dot {
            position: absolute; left: -29px; width: 16px; height: 16px;
            background: white; border: 4px solid #E0E2E7; border-radius: 50%;
        }
        .vt-item.active .vt-dot { border-color: var(--primary); background: var(--primary); }
        .vt-date { font-size: 13px; color: var(--text-sub); font-weight: 600; margin-bottom: 4px; }
        .vt-card { background: white; padding: 12px; border-radius: 12px; box-shadow: var(--shadow); border: 1px solid #eee; }
        .source-tag { font-size: 10px; padding: 2px 6px; border-radius: 4px; font-weight: bold; margin-left: auto; }
        .src-qr { background: #E1F0FF; color: var(--primary); }
        .src-ocr { background: #FFF4E5; color: var(--warning); }
    
        /* --- 4. MODALS & OVERLAYS --- */
        .overlay {
            position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 999;
            display: none; justify-content: center; align-items: center;
            backdrop-filter: blur(5px);
        }
        .overlay.open { display: flex; animation: fadeIn 0.2s; }
    
        /* Scan Modal */
        .scan-ui { width: 100%; height: 100%; display: flex; flex-direction: column; color: white; position: relative; }
        .cam-feed { position: absolute; inset: 0; background: #222; z-index: -1; } /* Mock Camera */
        .scan-frame {
            width: 280px; height: 280px; border: 4px solid rgba(255,255,255,0.3);
            border-radius: 24px; margin: auto; position: relative; overflow: hidden;
        }
        .scan-laser { width: 100%; height: 2px; background: var(--success); position: absolute; top: 0; animation: scanDown 2s infinite; box-shadow: 0 0 15px var(--success); }
        .scan-opts { position: absolute; bottom: 50px; width: 100%; text-align: center; }
        .btn-text-only { background: transparent; color: white; border: 1px solid white; padding: 10px 20px; border-radius: 20px; font-size: 14px; margin-top: 20px; }
    
        /* Drug Info Modal */
        .bottom-sheet {
            position: fixed; bottom: 0; left: 0; width: 100%; background: white;
            border-top-left-radius: 24px; border-top-right-radius: 24px;
            padding: 24px; transform: translateY(100%); transition: 0.3s; z-index: 1000;
        }
        .bottom-sheet.open { transform: translateY(0); }
        .bs-handle { width: 40px; height: 5px; background: #E0E2E7; border-radius: 10px; margin: 0 auto 20px; }
    
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scanDown { 0% { top: 0; } 50% { top: 100%; } 100% { top: 0; } }
    
    </style>
    
    ```
    
    </head>
    <body>
    
    <div id="app-container">
    
    ```
    <!-- HEADER -->
    <div class="z-header">
        <div class="header-avatar">👴</div>
        <span>HealFlow</span>
        <div class="header-sos" onclick="alert('Đang gọi con trai (Anh Tuấn)...')">SOS</div>
    </div>
    
    <!-- === PAGE 1: TRANG CHỦ (HOME) === -->
    <div id="page-home" class="page-content active">
    
        <!-- 1. AI Warning -->
        <div class="diag-card">
            <div class="diag-title"><span>⚠️</span> Nhắc nhở từ Bác sĩ</div>
            <div style="font-size: 14px; line-height: 1.4;">
                "Bác Nam nhớ uống thuốc đúng giờ. Viêm phế quản dễ tái phát nếu bỏ thuốc giữa chừng. <b>Tuyệt đối kiêng thuốc lá.</b>"
            </div>
        </div>
    
        <!-- 2. Timetable Horizontal -->
        <div class="section-title">
            📅 Lịch uống thuốc
            <span class="link-text" onclick="switchTab('page-calendar')">Xem tất cả ›</span>
        </div>
        <div class="h-scroll">
            <!-- Active Card -->
            <div class="time-card active">
                <div class="tc-head">
                    <div class="tc-time">12:00 • Trưa</div>
                    <div class="tc-tag tag-active">🔔 Ngay bây giờ</div>
                </div>
                <!-- Thuốc 1 -->
                <div class="drug-row" style="border-top:none; margin-top:0;">
                    <img src="<https://cdn-icons-png.flaticon.com/512/3022/3022323.png>" class="drug-img">
                    <div style="flex:1;">
                        <div style="display:flex; align-items:center;">
                            <span style="font-weight:700;">Panadol</span>
                            <div class="info-btn" onclick="openDrugInfo('Panadol')">?</div>
                        </div>
                        <span style="font-size:12px; color:var(--text-sub);">1 Viên - Sau ăn</span>
                    </div>
                </div>
                <!-- Thuốc 2 -->
                <div class="drug-row">
                    <img src="<https://cdn-icons-png.flaticon.com/512/883/883407.png>" class="drug-img">
                    <div style="flex:1;">
                        <div style="display:flex; align-items:center;">
                            <span style="font-weight:700;">Siro Ho</span>
                            <div class="info-btn" onclick="openDrugInfo('Siro Ho')">?</div>
                        </div>
                        <span style="font-size:12px; color:var(--text-sub);">1 Gói - Uống trực tiếp</span>
                    </div>
                </div>
            </div>
    
            <!-- Future Card -->
            <div class="time-card">
                <div class="tc-head">
                    <div class="tc-time">19:00 • Tối</div>
                    <div class="tc-tag" style="background:#eee; color:#666;">Sắp tới</div>
                </div>
                <div class="drug-row" style="border-top:none;">
                    <img src="<https://cdn-icons-png.flaticon.com/512/3022/3022323.png>" class="drug-img">
                    <div style="flex:1;">
                        <span style="font-weight:700;">Thuốc bổ não</span><br>
                        <span style="font-size:12px; color:var(--text-sub);">1 Viên - Trước ngủ</span>
                    </div>
                </div>
            </div>
        </div>
    
        <!-- 3. Predictive Actions -->
        <div class="section-title">💡 Bác muốn hỏi gì?</div>
        <div class="grid-2">
            <div class="big-btn" onclick="speakAI('Bác nên ăn cháo nóng, súp gà. Tránh đồ lạnh.')">
                <span class="bb-icon">🍲</span>
                <span class="bb-text">Nên ăn gì?</span>
            </div>
            <div class="big-btn" onclick="speakAI('Thuốc siro ho có thể gây buồn ngủ nhẹ ạ.')">
                <span class="bb-icon">😴</span>
                <span class="bb-text">Gây buồn ngủ?</span>
            </div>
            <div class="big-btn" onclick="speakAI('Bác nhớ tái khám vào sáng thứ 2 tuần sau nhé.')">
                <span class="bb-icon">📅</span>
                <span class="bb-text">Lịch tái khám</span>
            </div>
            <div class="big-btn" onclick="openChat()">
                <span class="bb-icon">🎙️</span>
                <span class="bb-text">Hỏi câu khác</span>
            </div>
        </div>
    </div>
    
    <!-- === PAGE 2: SỔ Y BẠ (HISTORY) === -->
    <div id="page-history" class="page-content">
        <div class="section-title">🗂️ Hồ sơ khám bệnh</div>
    
        <div class="v-timeline">
            <!-- Item 1 -->
            <div class="vt-item active">
                <div class="vt-dot"></div>
                <div class="vt-date">Hôm nay - 09/12/2025</div>
                <div class="vt-card">
                    <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                        <b style="color:var(--primary);">BV Đại học Y</b>
                        <span class="source-tag src-qr">QR Verified</span>
                    </div>
                    <div style="font-size:14px;">Viêm phế quản cấp</div>
                    <div style="font-size:12px; color:var(--text-sub); margin-top:4px;">3 loại thuốc • Bác sĩ A</div>
                </div>
            </div>
    
            <!-- Item 2 -->
            <div class="vt-item">
                <div class="vt-dot"></div>
                <div class="vt-date">01/11/2025</div>
                <div class="vt-card">
                    <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                        <b>Phòng khám Tư nhân</b>
                        <span class="source-tag src-ocr">Ảnh chụp</span>
                    </div>
                    <div style="font-size:14px;">Đau lưng (Thoát vị)</div>
                    <div style="font-size:12px; color:var(--text-sub); margin-top:4px;">2 loại thuốc • BS Hùng</div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- === PAGE 3: ĐẶT HẸN (BOOKING) === -->
    <div id="page-calendar" class="page-content">
        <div class="section-title">📅 Lịch tái khám sắp tới</div>
        <div class="card" style="text-align:center; padding:30px;">
            <div style="font-size:40px; color:var(--primary); font-weight:800;">15</div>
            <div style="font-size:18px; font-weight:bold; margin-bottom:10px;">Tháng 12, 2025 (Thứ Hai)</div>
            <div style="color:var(--text-sub);">Còn 6 ngày nữa</div>
            <div style="margin-top:20px; padding:10px; background:#F0F7FF; border-radius:8px; font-size:14px;">
                🏥 <b>BV Đại học Y</b> - Khoa Hô hấp<br>
                ⏰ 08:00 Sáng
            </div>
            <button style="margin-top:20px; background:var(--primary); color:white; border:none; padding:12px 24px; border-radius:20px; font-weight:bold;">Đặt xe Grab đến đó</button>
        </div>
    </div>
    
    <!-- === TAB BAR === -->
    <div class="tab-bar">
        <div class="tab-item active" onclick="switchTab('page-home', this)">
            <span class="tab-icon">🏠</span>
            <span>Trang chủ</span>
        </div>
    
        <!-- SCAN BUTTON -->
        <div class="scan-btn-wrapper" onclick="openScanModal()">
            <span class="scan-icon">📷</span>
        </div>
    
        <div class="tab-item" onclick="switchTab('page-history', this)">
            <span class="tab-icon">🗂️</span>
            <span>Sổ Y Bạ</span>
        </div>
    </div>
    
    <!-- === MODAL: SCAN QR/OCR === -->
    <div id="scan-modal" class="overlay">
        <div class="scan-ui">
            <div style="position:absolute; top:20px; right:20px; font-size:24px;" onclick="closeScanModal()">✕</div>
            <div style="margin-top:60px; text-align:center; font-size:18px; font-weight:bold;">Quét mã QR trên đơn</div>
    
            <div class="scan-frame">
                <div class="scan-laser"></div>
            </div>
    
            <div class="scan-opts">
                <p>Không có mã QR?</p>
                <button class="btn-text-only" onclick="simulateProcessing()">📷 Chụp ảnh đơn thuốc (OCR)</button>
            </div>
        </div>
    </div>
    
    <!-- === BOTTOM SHEET: DRUG INFO === -->
    <div class="overlay" id="drug-overlay" onclick="closeDrugInfo()"></div>
    <div class="bottom-sheet" id="drug-sheet">
        <div class="bs-handle"></div>
        <div style="text-align:center;">
            <img src="" id="d-img" style="width:80px; height:80px; margin-bottom:10px;">
            <h2 id="d-name" style="margin:0; color:var(--primary);">Tên thuốc</h2>
            <p id="d-desc" style="background:#F5F6F8; padding:15px; border-radius:12px; margin:15px 0; text-align:left;">
                Mô tả thuốc...
            </p>
            <button style="width:100%; padding:15px; background:var(--primary); color:white; border:none; border-radius:16px; font-weight:bold;" onclick="speakAI(document.getElementById('d-desc').innerText)">🔊 Nghe giải thích</button>
        </div>
    </div>
    
    ```
    
    </div>
    
    <script>
    /* 1. NAVIGATION LOGIC */
    function switchTab(pageId, tabElement) {
    // Hide all pages
    document.querySelectorAll('.page-content').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    
    ```
        // Update TabBar (Optional for Scan/Calendar pages logic)
        if(tabElement) {
            document.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
            tabElement.classList.add('active');
        }
    }
    
    /* 2. SCAN MODAL LOGIC */
    function openScanModal() { document.getElementById('scan-modal').classList.add('open'); }
    function closeScanModal() { document.getElementById('scan-modal').classList.remove('open'); }
    
    function simulateProcessing() {
        closeScanModal();
        alert("🔄 Đang gửi ảnh lên VNPT OCR...\\nAI đang đọc đơn thuốc...");
        setTimeout(() => {
            alert("✅ Đã thêm đơn thuốc mới vào Hồ sơ!");
            switchTab('page-home'); // Reload Home logic here
        }, 1500);
    }
    
    /* 3. DRUG INFO SHEET LOGIC */
    const drugDB = {
        'Panadol': { img: '<https://cdn-icons-png.flaticon.com/512/3022/3022323.png>', desc: 'Panadol giúp bác giảm đau đầu và hạ sốt. Thuốc này lành tính, nhưng bác nhớ uống sau khi ăn no nhé.' },
        'Siro Ho': { img: '<https://cdn-icons-png.flaticon.com/512/883/883407.png>', desc: 'Siro này giúp long đờm, giảm ho. Có thể gây buồn ngủ nhẹ, bác nên ngủ trưa sau khi uống.' }
    };
    
    function openDrugInfo(name) {
        const data = drugDB[name];
        document.getElementById('d-img').src = data.img;
        document.getElementById('d-name').innerText = name;
        document.getElementById('d-desc').innerText = data.desc;
    
        document.getElementById('drug-overlay').classList.add('open');
        document.getElementById('drug-sheet').classList.add('open');
    
        // Auto speak
        speakAI(data.desc);
    }
    
    function closeDrugInfo() {
        document.getElementById('drug-overlay').classList.remove('open');
        document.getElementById('drug-sheet').classList.remove('open');
        window.speechSynthesis.cancel();
    }
    
    /* 4. UTILS */
    function speakAI(text) {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const u = new SpeechSynthesisUtterance(text);
            u.lang = 'vi-VN';
            window.speechSynthesis.speak(u);
        }
        // Visual feedback for demo
        console.log("AI Speaking:", text);
    }
    
    function openChat() {
        alert("🎙️ Mở tính năng Chat Voice (VNPT SmartBot)");
    }
    
    ```
    
    </script>
    
    </body>
    </html>


- v5
    <!DOCTYPE html>
    <html lang="vi">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>HealFlow - Zalo Mini App</title>
    <style>
    /* --- CORE VARIABLES --- */
    :root {
    --zalo-blue: #0068FF;
    --bg: #F2F4F7;
    --card-bg: #FFFFFF;
    --text-main: #232731;
    --text-sub: #767A82;
    --active-shadow: 0 8px 20px rgba(0, 104, 255, 0.2);
    }
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: var(--bg); color: var(--text-main); -webkit-font-smoothing: antialiased; padding-top: 50px; padding-bottom: 90px; }
    
    ```
        /* Zalo Header Mockup */
        .z-header { position: fixed; top: 0; width: 100%; height: 48px; background: white; display: flex; align-items: center; justify-content: center; font-weight: 600; border-bottom: 1px solid #E0E2E7; z-index: 100; color: var(--text-main); }
    
        /* COMMON: Section Title */
        .sec-title { padding: 0 16px; margin: 24px 0 12px; font-size: 16px; font-weight: 700; color: var(--text-main); display: flex; justify-content: space-between; align-items: center; }
    
        /* --- 1. HORIZONTAL TIMETABLE (LỊCH UỐNG THUỐC) --- */
        .h-scroll {
            display: flex; overflow-x: auto; gap: 12px; padding: 0 16px;
            scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch;
            scrollbar-width: none; /* Hide scrollbar Firefox */
        }
        .h-scroll::-webkit-scrollbar { display: none; /* Hide scrollbar Chrome */ }
    
        .time-card {
            flex: 0 0 85%; /* Chiếm 85% màn hình để lộ thẻ sau */
            background: white; border-radius: 16px; padding: 16px;
            scroll-snap-align: center; border: 1px solid #E0E2E7;
            transition: transform 0.2s; position: relative; overflow: hidden;
        }
    
        /* Trạng thái: Hiện tại (Active) */
        .time-card.active {
            border: 2px solid var(--zalo-blue);
            box-shadow: var(--active-shadow);
            transform: scale(1.02); background: #F5F9FF;
        }
        /* Trạng thái: Quá khứ (Past) */
        .time-card.past { opacity: 0.6; background: #F2F4F7; filter: grayscale(1); }
    
        .tc-header { display: flex; justify-content: space-between; margin-bottom: 12px; }
        .tc-time { font-size: 18px; font-weight: 800; color: var(--zalo-blue); }
        .tc-status { font-size: 12px; font-weight: 600; background: #E1E9F6; padding: 4px 8px; border-radius: 6px; color: var(--zalo-blue); }
        .time-card.past .tc-status { background: #E0E2E7; color: #767A82; }
    
        .tc-meds { display: flex; align-items: center; gap: 12px; }
        .tc-img { width: 50px; height: 50px; background: white; border-radius: 10px; padding: 5px; object-fit: contain; border: 1px solid #eee; }
        .tc-info h4 { margin: 0 0 4px; font-size: 16px; }
        .tc-info p { margin: 0; font-size: 13px; color: var(--text-sub); }
    
        /* --- 2. BIG QUESTION CARDS (CÂU HỎI TO) --- */
        .q-scroll {
            display: flex; overflow-x: auto; gap: 12px; padding: 0 16px;
            scroll-snap-type: x mandatory;
        }
        .q-card {
            flex: 0 0 45%; /* Hiện 2 thẻ rưỡi */
            background: white; border-radius: 16px; padding: 16px;
            display: flex; flex-direction: column; align-items: center; text-align: center;
            border: 1px solid #E0E2E7; height: 140px; justify-content: center;
            box-shadow: 0 4px 10px rgba(0,0,0,0.03); scroll-snap-align: start;
            position: relative;
        }
        .q-card:active { transform: scale(0.96); background: #F2F4F7; }
    
        .q-icon { font-size: 36px; margin-bottom: 10px; }
        .q-text { font-size: 14px; font-weight: 600; color: var(--text-main); line-height: 1.4; }
        .q-tap { font-size: 10px; color: var(--zalo-blue); margin-top: 8px; font-weight: bold; text-transform: uppercase; }
    
        /* --- 3. DIAGNOSIS SUMMARY (AI GENERATED) --- */
        .diag-card {
            margin: 16px; padding: 16px; background: #FFF8E1;
            border-radius: 12px; border: 1px solid #FFECB3;
        }
        .diag-head { display: flex; gap: 10px; font-weight: bold; color: #B94A00; margin-bottom: 8px; font-size: 15px; }
    
        /* --- FLOATING MIC --- */
        .float-mic {
            position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
            background: #FF3B30; color: white; padding: 12px 24px; border-radius: 30px;
            display: flex; align-items: center; gap: 8px; font-weight: 600;
            box-shadow: 0 8px 20px rgba(255, 59, 48, 0.3); z-index: 99; cursor: pointer;
        }
    </style>
    
    ```
    
    </head>
    <body>
    
    ```
    <div class="z-header">HealFlow</div>
    
    <!-- 1. TÓM TẮT BỆNH & LỜI DẶN (KÍCH CẦU TÁI KHÁM) -->
    <div class="diag-card">
        <div class="diag-head">
            <span>⚠️</span> Chẩn đoán: Viêm Dạ Dày Cấp
        </div>
        <div style="font-size: 14px; color: #4e342e; line-height: 1.5;">
            "Dạ dày đang bị tổn thương niêm mạc. Bác tuyệt đối <b>kiêng rượu bia, đồ chua cay</b> nhé. Nếu không uống thuốc đủ liều rất dễ bị loét mãn tính."
        </div>
    </div>
    
    <!-- 2. LỊCH UỐNG THUỐC (HORIZONTAL SCROLL) -->
    <div class="sec-title">
        📅 Lịch trình hôm nay
        <span style="font-size:12px; font-weight:normal; color:#0068FF;">Xem tất cả ›</span>
    </div>
    
    <div class="h-scroll">
        <!-- Card Quá Khứ -->
        <div class="time-card past">
            <div class="tc-header">
                <div class="tc-time">07:00 • Sáng</div>
                <div class="tc-status">Đã qua</div>
            </div>
            <div class="tc-meds">
                <img src="<https://cdn-icons-png.flaticon.com/512/822/822123.png>" class="tc-img">
                <div class="tc-info">
                    <h4>Thuốc tráng dạ dày</h4>
                    <p>1 Gói (Uống xong)</p>
                </div>
            </div>
        </div>
    
        <!-- Card Hiện Tại (Active) -->
        <div class="time-card active">
            <div style="position:absolute; top:0; left:0; width:4px; height:100%; background:var(--zalo-blue);"></div>
            <div class="tc-header">
                <div class="tc-time">12:00 • Trưa nay</div>
                <div class="tc-status" style="background:#0068FF; color:white;">🔔 Ngay bây giờ</div>
            </div>
            <div class="tc-meds">
                <img src="<https://cdn-icons-png.flaticon.com/512/3022/3022323.png>" class="tc-img">
                <div class="tc-info">
                    <h4 style="color:var(--zalo-blue); font-size:17px;">1 Gói P + 1 Viên nén</h4>
                    <p style="color:#333; font-weight:500;">Uống trước ăn 30 phút</p>
                </div>
            </div>
        </div>
    
        <!-- Card Tương Lai -->
        <div class="time-card">
            <div class="tc-header">
                <div class="tc-time">19:00 • Tối</div>
                <div class="tc-status">Sắp tới</div>
            </div>
            <div class="tc-meds">
                <img src="<https://cdn-icons-png.flaticon.com/512/822/822123.png>" class="tc-img">
                <div class="tc-info">
                    <h4>Thuốc tráng dạ dày</h4>
                    <p>1 Gói - Trước ăn</p>
                </div>
            </div>
        </div>
    </div>
    
    <!-- 3. AI CÂU HỎI THƯỜNG GẶP (BIG CARDS) -->
    <div class="sec-title">
        💡 Bác có muốn hỏi?
        <span style="font-size:12px; font-weight:normal; color:#767A82;">AI gợi ý</span>
    </div>
    
    <div class="q-scroll">
        <!-- Câu 1 -->
        <div class="q-card" onclick="speakAI('Bác nên ăn cháo thịt băm, canh bí đỏ. Tránh ăn dưa cà muối nhé.')">
            <div class="q-icon">🍲</div>
            <div class="q-text">Bệnh này nên ăn gì?</div>
            <div class="q-tap">Chạm để nghe</div>
        </div>
    
        <!-- Câu 2 -->
        <div class="q-card" onclick="speakAI('Thuốc này có thể gây buồn ngủ nhẹ, bác nên ngủ trưa sau khi uống.')">
            <div class="q-icon">😴</div>
            <div class="q-text">Thuốc có gây buồn ngủ?</div>
            <div class="q-tap">Chạm để nghe</div>
        </div>
    
        <!-- Câu 3 -->
        <div class="q-card" onclick="speakAI('Dạ thuốc uống hết trong 5 ngày. Bác nhớ quay lại tái khám vào thứ Hai tuần sau.')">
            <div class="q-icon">📅</div>
            <div class="q-text">Khi nào tái khám?</div>
            <div class="q-tap">Chạm để nghe</div>
        </div>
    
         <!-- Câu 4 -->
         <div class="q-card" onclick="speakAI('Đang kết nối Zalo gọi cho con trai bác...')">
            <div class="q-icon">📞</div>
            <div class="q-text">Gọi cho con tôi</div>
            <div class="q-tap">Chạm để gọi</div>
        </div>
    </div>
    
    <!-- Floating Mic -->
    <div class="float-mic" onclick="speakAI('Mời bác nói, AI đang nghe...')">
        <span style="font-size:20px;">🎙️</span> Giữ để hỏi
    </div>
    
    <script>
        function speakAI(text) {
            // Giả lập AI trả lời
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                const u = new SpeechSynthesisUtterance(text);
                u.lang = 'vi-VN';
                window.speechSynthesis.speak(u);
            }
            alert("🔊 AI Trả lời: " + text);
        }
    </script>
    
    ```
    
    </body>
    </html>

- v6
    <!DOCTYPE html>
    <html lang="vi">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>HealFlow - Drug Info Update</title>
    <style>
    /* --- GIỮ NGUYÊN CSS CŨ --- */
    :root { --zalo-blue: #0068FF; --bg: #F2F4F7; --text-main: #232731; --text-sub: #767A82; }
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: var(--bg); color: var(--text-main); padding-top: 50px; padding-bottom: 90px; }
    .z-header { position: fixed; top: 0; width: 100%; height: 48px; background: white; display: flex; align-items: center; justify-content: center; font-weight: 600; border-bottom: 1px solid #E0E2E7; z-index: 100; }
    .sec-title { padding: 0 16px; margin: 24px 0 12px; font-size: 16px; font-weight: 700; display: flex; justify-content: space-between; }
    
    ```
        /* TIMETABLE STYLES */
        .h-scroll { display: flex; overflow-x: auto; gap: 12px; padding: 0 16px; scrollbar-width: none; }
        .time-card { flex: 0 0 85%; background: white; border-radius: 16px; padding: 16px; border: 1px solid #E0E2E7; position: relative; }
        .time-card.active { border: 2px solid var(--zalo-blue); background: #F5F9FF; transform: scale(1.02); box-shadow: 0 8px 20px rgba(0, 104, 255, 0.2); }
        .tc-header { display: flex; justify-content: space-between; margin-bottom: 12px; }
        .tc-time { font-size: 18px; font-weight: 800; color: var(--zalo-blue); }
        .tc-meds { display: flex; align-items: flex-start; gap: 12px; margin-top: 10px; }
        .tc-img { width: 50px; height: 50px; object-fit: contain; background: white; border-radius: 8px; border: 1px solid #eee; }
    
        /* --- NEW: BUTTON INFO STYLE --- */
        .btn-info {
            display: inline-flex; align-items: center; justify-content: center;
            width: 24px; height: 24px; border-radius: 50%;
            background: #E1E9F6; color: var(--zalo-blue);
            font-size: 12px; font-weight: bold; margin-left: 8px; cursor: pointer;
        }
    
        /* --- NEW: DRUG MODAL (POPUP) --- */
        .modal-overlay {
            position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 200;
            display: none; align-items: center; justify-content: center;
            opacity: 0; transition: opacity 0.3s; backdrop-filter: blur(4px);
        }
        .modal-overlay.open { display: flex; opacity: 1; }
    
        .drug-card {
            background: white; width: 90%; max-width: 350px; border-radius: 20px;
            padding: 20px; position: relative; transform: translateY(20px); transition: 0.3s;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
        }
        .modal-overlay.open .drug-card { transform: translateY(0); }
    
        .dc-close { position: absolute; top: 15px; right: 15px; font-size: 24px; color: #999; cursor: pointer; }
        .dc-img { width: 80px; height: 80px; margin: 0 auto 15px; display: block; object-fit: contain; }
        .dc-title { font-size: 20px; font-weight: bold; text-align: center; margin-bottom: 5px; color: var(--zalo-blue); }
        .dc-summary { text-align: center; font-size: 15px; color: #444; line-height: 1.5; margin-bottom: 20px; background: #F5F9FF; padding: 10px; border-radius: 12px; }
    
        /* Questions inside Modal */
        .dc-questions { display: flex; flex-direction: column; gap: 10px; }
        .dq-chip {
            background: white; border: 1px solid #E0E2E7; padding: 12px; border-radius: 12px;
            font-size: 14px; font-weight: 500; display: flex; align-items: center; gap: 10px; cursor: pointer;
        }
        .dq-chip:active { background: #F0F0F0; }
        .dq-icon { font-size: 18px; }
    
    </style>
    
    ```
    
    </head>
    <body>
    
    ```
    <div class="z-header">HealFlow</div>
    
    <!-- TIMETABLE -->
    <div class="sec-title">📅 Lịch trình hôm nay</div>
    <div class="h-scroll">
        <!-- Card Active -->
        <div class="time-card active">
            <div class="tc-header">
                <div class="tc-time">12:00 • Trưa nay</div>
                <div style="background:#0068FF; color:white; padding:4px 8px; border-radius:6px; font-size:12px;">🔔 Hiện tại</div>
            </div>
    
            <!-- Thuốc 1 -->
            <div class="tc-meds">
                <img src="<https://cdn-icons-png.flaticon.com/512/3022/3022323.png>" class="tc-img">
                <div>
                    <div style="display:flex; align-items:center;">
                        <h4 style="margin:0; font-size:16px;">Panadol Extra</h4>
                        <!-- NÚT INFO Ở ĐÂY -->
                        <div class="btn-info" onclick="showDrugInfo('Panadol')">?</div>
                    </div>
                    <p style="margin:2px 0 0; font-size:13px; color:#666;">1 Viên - Giảm đau</p>
                </div>
            </div>
    
            <!-- Thuốc 2 -->
            <div class="tc-meds">
                <img src="<https://cdn-icons-png.flaticon.com/512/883/883407.png>" class="tc-img">
                <div>
                    <div style="display:flex; align-items:center;">
                        <h4 style="margin:0; font-size:16px;">Augmentin</h4>
                        <!-- NÚT INFO Ở ĐÂY -->
                        <div class="btn-info" onclick="showDrugInfo('Augmentin')">?</div>
                    </div>
                    <p style="margin:2px 0 0; font-size:13px; color:#666;">1 Viên - Kháng sinh</p>
                </div>
            </div>
        </div>
    </div>
    
    <!-- MODAL POPUP (Ẩn mặc định) -->
    <div class="modal-overlay" id="drug-modal" onclick="closeModal(event)">
        <div class="drug-card">
            <div class="dc-close" onclick="closeModal(event, true)">×</div>
    
            <img src="<https://cdn-icons-png.flaticon.com/512/3022/3022323.png>" class="dc-img" id="m-img">
            <div class="dc-title" id="m-title">Tên Thuốc</div>
    
            <!-- AI Summary -->
            <div class="dc-summary" id="m-desc">
                Đang tải thông tin từ AI...
            </div>
    
            <!-- AI Suggestion Questions -->
            <div style="font-size:12px; font-weight:bold; color:#888; margin-bottom:8px;">BÁC MUỐN HỎI GÌ THÊM?</div>
            <div class="dc-questions" id="m-questions">
                <!-- Chips được JS render vào đây -->
            </div>
        </div>
    </div>
    
    <script>
        // Dữ liệu giả lập từ AI Backend
        const drugData = {
            'Panadol': {
                desc: "Đây là thuốc giảm đau, hạ sốt thông thường. Giúp bác đỡ đau đầu và mỏi người.",
                questions: [
                    { icon: "🤢", text: "Có hại dạ dày không?", ans: "Thuốc này ít hại dạ dày, nhưng bác nên uống lúc no cho chắc nhé." },
                    { icon: "😴", text: "Có gây buồn ngủ không?", ans: "Dạ không, thuốc này không gây buồn ngủ ạ." }
                ],
                img: "<https://cdn-icons-png.flaticon.com/512/3022/3022323.png>"
            },
            'Augmentin': {
                desc: "Đây là thuốc Kháng sinh diệt vi khuẩn. Bác PHẢI uống đủ 5 ngày, không được bỏ dở nhé.",
                questions: [
                    { icon: "🚽", text: "Uống vào bị đi ngoài?", ans: "Dạ đúng, thuốc này có thể gây đi ngoài nhẹ. Bác ăn thêm sữa chua nhé." },
                    { icon: "🥛", text: "Uống với sữa được không?", ans: "Tốt nhất bác nên uống với nước lọc ạ." }
                ],
                img: "<https://cdn-icons-png.flaticon.com/512/883/883407.png>"
            }
        };
    
        function showDrugInfo(drugName) {
            const modal = document.getElementById('drug-modal');
            const data = drugData[drugName];
    
            // Fill Data
            document.getElementById('m-title').innerText = drugName;
            document.getElementById('m-desc').innerText = data.desc;
            document.getElementById('m-img').src = data.img;
    
            // Fill Questions
            const qContainer = document.getElementById('m-questions');
            qContainer.innerHTML = ""; // Clear old
            data.questions.forEach(q => {
                qContainer.innerHTML += `
                    <div class="dq-chip" onclick="speakAns('${q.ans}')">
                        <span class="dq-icon">${q.icon}</span> ${q.text}
                    </div>
                `;
            });
    
            // Show Modal
            modal.classList.add('open');
    
            // Auto Speak Summary
            speak(data.desc);
        }
    
        function speakAns(text) {
            alert("🔊 AI Nói: " + text);
            speak(text);
        }
    
        function closeModal(e, force) {
            if (e.target.id === 'drug-modal' || force) {
                document.getElementById('drug-modal').classList.remove('open');
                window.speechSynthesis.cancel(); // Stop talking
            }
        }
    
        function speak(text) {
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                const u = new SpeechSynthesisUtterance(text);
                u.lang = 'vi-VN';
                window.speechSynthesis.speak(u);
            }
        }
    </script>
    
    ```
    
    </body>
    </html>
