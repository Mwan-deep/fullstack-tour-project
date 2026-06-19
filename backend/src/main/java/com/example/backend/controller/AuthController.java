package com.example.backend.controller;

import com.example.backend.dto.AuthRequest;
import com.example.backend.dto.AuthResponse;
import com.example.backend.entity.User;
import com.example.backend.repository.UserRepository;
import com.example.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil; // Khai báo máy in thẻ

    @Autowired
    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    // API Đăng ký (Đã làm ở bước trước, giữ nguyên)
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Lỗi: Username đã tồn tại!");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("ROLE_USER");
        userRepository.save(user);

        return ResponseEntity.ok("Đăng ký tài khoản thành công!");
    }

    // API Đăng nhập (MỚI)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        // 1. Tìm user trong database
        Optional<User> userOptional = userRepository.findByUsername(request.getUsername());

        // 2. Nếu không tìm thấy user, báo lỗi 401
        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Tài khoản không tồn tại!");
        }

        User user = userOptional.get();

        // 3. Kiểm tra mật khẩu (So sánh mật khẩu người dùng gõ vào với mã Hash lưu trong DB)
        // Lưu ý: Không được dùng phép == hay equals(), BẮT BUỘC dùng passwordEncoder.matches()
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Sai mật khẩu!");
        }

        // 4. Nếu mọi thứ OK -> In thẻ JWT
        String token = jwtUtil.generateToken(user.getUsername());

        // 5. Trả thẻ về cho Frontend
        return ResponseEntity.ok(new AuthResponse(token, "Đăng nhập thành công!"));
    }
}