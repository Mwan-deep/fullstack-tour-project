package com.example.backend.config;

import com.example.backend.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    @Autowired
    public JwtAuthenticationFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // 1. Lấy chuỗi từ Header có tên là "Authorization"
        String header = request.getHeader("Authorization");

        // 2. Kiểm tra xem header có tồn tại và bắt đầu bằng chuẩn "Bearer " không
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7); // Cắt bỏ 7 ký tự "Bearer " để lấy mã token nguyên chất
            try {
                // 3. Giải mã token lấy username
                String username = jwtUtil.extractUsername(token);

                // 4. Nếu token chuẩn và user chưa được lưu trong phiên hiện tại
                if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                    // Cấp thẻ thông hành của Spring Security để request được đi tiếp
                    UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(username, null, new ArrayList<>());
                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
            } catch (Exception e) {
                // Token sai, hết hạn, hoặc bị sửa đổi -> In ra log (thực tế production sẽ dùng Logger)
                System.out.println("Lỗi xác thực Token: " + e.getMessage());
            }
        }

        // 5. Chuyển request đi tiếp tới màng lọc tiếp theo hoặc Controller
        filterChain.doFilter(request, response);
    }
}